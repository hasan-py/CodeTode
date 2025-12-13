import { LearnerProgress } from "../../entity/learningProgress/learnerProgress";
import { LearnerProgressRepository } from "../../repository";
import { BaseService } from "../common/base";

export class LearnerProgressService extends BaseService<LearnerProgress> {
  constructor() {
    super(LearnerProgressRepository);
  }

  async updatePosition(
    userId: number,
    courseId: number,
    moduleId?: number,
    chapterId?: number,
    lessonId?: number
  ) {
    const existing = await this.repository.findOne({
      where: { userId, courseId },
    });

    if (existing) {
      return await this.repository.update(
        { userId, courseId },
        { moduleId, chapterId, lessonId }
      );
    } else {
      return await this.repository.save({
        userId,
        courseId,
        moduleId,
        chapterId,
        lessonId,
      });
    }
  }
}

export const learnerProgressService = new LearnerProgressService();
