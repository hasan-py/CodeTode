import { EUserRole, EUserStatus } from "@packages/definitions";
import { User } from "../../entity/account/user";
import { UserRepository } from "../../repository";
import { BaseService } from "../../services/common/base";
import { learnerStatisticsService } from "../learningProgress/learnerStatistics";

export class UserService extends BaseService<User> {
  constructor() {
    super(UserRepository);
  }

  async getUserProfile(id: number) {
    const user = await this.repository.findOne({
      where: { id },
      relations: ["courseEnrollments"],
    });

    if (!user) return null;

    const learnerStatistics =
      await learnerStatisticsService.getLearnerStatistics(user.id);

    return {
      ...user,
      courseEnrollments:
        user.courseEnrollments?.map(
          (enrollment: any) => enrollment?.courseId
        ) || [],
      currentStreak: learnerStatistics?.currentStreak || 0,
      longestStreak: learnerStatistics?.longestStreak || 0,
      totalXp: learnerStatistics?.totalXp || 0,
    };
  }

  async updateUserProfile(payload: {
    id: number;
    name: string;
    imageUrl: string;
  }): Promise<User | null> {
    return await this.update(payload.id, {
      name: payload.name,
      imageUrl: payload.imageUrl,
    });
  }

  async getAllActiveLearner() {
    return await UserRepository.createQueryBuilder("user")
      .leftJoin(
        "course_enrollment",
        "enrollment",
        "enrollment.userId = user.id AND enrollment.status = 'active'"
      )
      .leftJoin("course", "course", "course.id = enrollment.courseId")
      .leftJoin(
        "learner_activity",
        "activity",
        "activity.userId = user.id AND activity.courseId = enrollment.courseId"
      )
      .leftJoin(
        "lesson",
        "lesson",
        "lesson.courseId = enrollment.courseId AND lesson.status = 'published'"
      )
      .leftJoin("learner_statistics", "stats", "stats.userId = user.id")
      .select([
        "user.id as userId",
        "user.githubId as githubId",
        "user.username as username",
        "user.name as name",
        "user.email as email",
        "user.createdAt as joinedAt",
        "user.imageUrl as imageUrl",
        "user.role as role",
        "user.status as status",
        "user.lastLogin as lastLogin",
        "user.createdAt as createdAt",
        "user.updatedAt as updatedAt",
        "COALESCE(stats.totalXp, 0) as totalXp",
        "COALESCE(stats.currentStreak, 0) as currentStreak",
        "enrollment.courseId as courseId",
        "course.name as courseName",
        "enrollment.totalPrice as coursePrice",
        "COUNT(DISTINCT lesson.id) as totalLessons",
        "COUNT(DISTINCT activity.lessonId) as completedLessons",
      ])
      .where("user.status = :status", { status: EUserStatus.ACTIVE })
      .andWhere("user.role = :role", { role: EUserRole.LEARNER })
      .groupBy(
        "user.id, stats.totalXp, stats.currentStreak, enrollment.courseId, course.name, enrollment.totalPrice"
      )
      .orderBy("user.id", "ASC")
      .addOrderBy("enrollment.courseId", "ASC")
      .cache(60000)
      .getRawMany();
  }
}

export const userService = new UserService();
