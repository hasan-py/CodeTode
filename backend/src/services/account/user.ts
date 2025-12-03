import { User } from "../../entity/account/ user";
import { UserRepository } from "../../repository";
import { BaseService } from "../../services/common/base";

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
    return {
      ...user,
      courseEnrollments:
        user.courseEnrollments?.map(
          (enrollment: any) => enrollment?.courseId
        ) || [],
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
