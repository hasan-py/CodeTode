import { EntityManager } from "typeorm";
import { LearnerStatistics } from "../../entity/learningProgress/learnerStatistics";
import { LearnerStatisticsRepository } from "../../repository";
import { BaseService } from "../common/base";
import { Cacheable } from "../../decorators/cacheDecorator";

export class LearnerStatisticsService extends BaseService<LearnerStatistics> {
  constructor() {
    super(LearnerStatisticsRepository);
  }

  async updateStatistics(
    userId: number,
    xpEarned: number,
    transactionalEntityManager: EntityManager,
    currentLessonId?: number
  ): Promise<LearnerStatistics> {
    // Get current UTC date and yesterday
    const now = new Date();
    const todayUTC = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );
    const yesterdayUTC = new Date(todayUTC);
    yesterdayUTC.setUTCDate(yesterdayUTC.getUTCDate() - 1);

    // Get or create stats record first
    let stats = await transactionalEntityManager.findOne(LearnerStatistics, {
      where: { userId },
    });

    // Calculate new streak based on activity history
    const newStreak = await this.calculateStreak(
      userId,
      todayUTC,
      yesterdayUTC,
      transactionalEntityManager,
      stats,
      currentLessonId
    );

    if (stats) {
      stats.totalXp += xpEarned;
      stats.currentStreak = newStreak;
      if (newStreak > stats.longestStreak) {
        stats.longestStreak = newStreak;
      }
    } else {
      // First activity for this user
      stats = transactionalEntityManager.create(LearnerStatistics, {
        userId,
        totalXp: xpEarned,
        currentStreak: newStreak,
        longestStreak: newStreak,
      });
    }

    return await transactionalEntityManager.save(stats);
  }

  async getLearnerStatistics(
    userId: number
  ): Promise<LearnerStatistics | null> {
    return await LearnerStatisticsRepository.findOne({
      where: { userId },
      cache: 30000, // Cache for 30 seconds for high-traffic scenarios
    });
  }

  @Cacheable({
    key: "products:leaderboard",
    ttl: "oneHour",
  })
  async getLeaderboard(
    limit: number = 100,
    sortBy: "totalXp" | "currentStreak" | "longestStreak" = "totalXp"
  ): Promise<
    Array<
      { userId: number; name: string; imageUrl: string | null } & Pick<
        LearnerStatistics,
        "totalXp" | "currentStreak" | "longestStreak"
      >
    >
  > {
    return await LearnerStatisticsRepository.createQueryBuilder("stats")
      .innerJoin("user", "user", "user.id = stats.userId")
      .select([
        'stats.userId as "userId"',
        'user.name as "name"',
        'user.imageUrl as "imageUrl"',
        'stats.totalXp as "totalXp"',
        'stats.currentStreak as "currentStreak"',
        'stats.longestStreak as "longestStreak"',
      ])
      .where("user.status = 'active'")
      .orderBy(`stats.${sortBy}`, "DESC")
      .limit(limit)
      .cache(60000)
      .getRawMany();
  }

  /**
   * Calculate streak based on consecutive days of activity
   * This is the core streak logic that handles all scenarios properly
   */
  private async calculateStreak(
    userId: number,
    todayUTC: Date,
    yesterdayUTC: Date,
    transactionalEntityManager: EntityManager,
    currentStats: LearnerStatistics | null,
    currentLessonId?: number
  ): Promise<number> {
    const todayDateOnly = todayUTC.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    // Check if user already has activity today EXCLUDING the current lesson being completed
    let hasActivityTodayQuery = `
      SELECT COUNT(*) as count
      FROM learner_activity
      WHERE "userId" = $1 AND "date" = $2
    `;

    const queryParams: any[] = [userId, todayDateOnly];

    // If we have currentLessonId, exclude it from the count to avoid counting the current transaction
    if (currentLessonId) {
      hasActivityTodayQuery += ` AND "lessonId" != $3`;
      queryParams.push(currentLessonId);
    }

    const hasActivityToday = await transactionalEntityManager.query(
      hasActivityTodayQuery,
      queryParams
    );
    const alreadyActiveToday = parseInt(hasActivityToday[0].count) > 0;

    if (alreadyActiveToday) {
      // User already completed other lessons today, don't change streak
      return currentStats?.currentStreak || 1;
    }

    // This is the first activity today - calculate proper streak
    // Get all unique activity dates for this user, ordered by date (excluding current lesson if provided)
    let activityDatesQuery = `
      SELECT DISTINCT "date" as activity_date
      FROM learner_activity
      WHERE "userId" = $1
    `;

    const activityQueryParams: any[] = [userId];

    if (currentLessonId) {
      activityDatesQuery += ` AND "lessonId" != $2`;
      activityQueryParams.push(currentLessonId);
    }

    activityDatesQuery += ` ORDER BY activity_date DESC`;

    const activityDates = await transactionalEntityManager.query(
      activityDatesQuery,
      activityQueryParams
    );

    if (activityDates.length === 0) {
      // No previous activities, this starts streak at 1
      return 1;
    }

    // Calculate consecutive days ending with yesterday
    let consecutiveDays = 0;
    const yesterdayDateOnly = yesterdayUTC.toISOString().slice(0, 10);
    let checkDate = yesterdayDateOnly;

    for (const row of activityDates) {
      const activityDateStr = row.activity_date;

      if (activityDateStr === checkDate) {
        // Found activity for this date, increment consecutive days
        consecutiveDays++;
        // Move to previous day
        const previousDate = new Date(checkDate);
        previousDate.setUTCDate(previousDate.getUTCDate() - 1);
        checkDate = previousDate.toISOString().slice(0, 10);
      } else if (activityDateStr < checkDate) {
        // There's a gap - break the streak
        break;
      }
      // If activityDateStr > checkDate, continue looking for the right date
    }

    // Today's activity continues the streak
    return consecutiveDays + 1;
  }
}

export const learnerStatisticsService = new LearnerStatisticsService();
