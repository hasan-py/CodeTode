import { User } from "../../entity/account/ user";
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
}

export const userService = new UserService();
