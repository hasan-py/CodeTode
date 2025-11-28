import { LessonContentLink } from "../../entity/course/lessonContentLink";
import { LessonContentLinkRepository } from "../../repository";
import { BaseService } from "../common/base";

export class LessonContentLinkService extends BaseService<LessonContentLink> {
  constructor() {
    super(LessonContentLinkRepository);
  }

  async getLessonContentLinkById(
    id: number
  ): Promise<LessonContentLink | null> {
    return this.getById(id);
  }

  async createLessonContentLink(data: Partial<LessonContentLink>) {
    if (data.position === undefined) {
      const highestPositionCourse = await this.repository
        .createQueryBuilder("lessonContentLink")
        .orderBy("lessonContentLink.position", "DESC")
        .getOne();

      const highestPosition = highestPositionCourse?.position ?? 0;
      data.position = highestPosition + 1;
    }

    return this.create(data);
  }

  async updateLessonContentLink(id: number, data: Partial<LessonContentLink>) {
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
    return this.update(id, cleanedData);
  }
}

export const lessonContentLinkService = new LessonContentLinkService();
