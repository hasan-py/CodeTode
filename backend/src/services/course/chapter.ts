import {
  ECourseStatus,
  IChapterFilters,
  IChapterResponse,
  TUpdatePositionArray,
} from "@packages/definitions";
import { Chapter } from "../../entity/course/chapter";
import { ChapterRepository } from "../../repository";
import { BaseService } from "../common/base";

export class ChapterService extends BaseService<Chapter> {
  constructor() {
    super(ChapterRepository);
  }

  async listChapters(options: IChapterFilters = {}): Promise<
    Omit<IChapterResponse, "chapters"> & {
      chapters: Chapter[];
    }
  > {
    const { page = 1, limit = 10, status, moduleId, courseId } = options;
    const offset = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder("chapter")
      .leftJoinAndSelect("chapter.course", "course")
      .leftJoinAndSelect("chapter.module", "module");
    // .loadRelationCountAndMap("chapter.lessonCount", "chapter.lessons");

    if (status) queryBuilder.andWhere("chapter.status = :status", { status });

    if (moduleId)
      queryBuilder.andWhere("chapter.moduleId = :moduleId", { moduleId });

    if (courseId)
      queryBuilder.andWhere("chapter.courseId = :courseId", { courseId });

    const [chapters, total] = await queryBuilder
      .orderBy("chapter.position", "ASC")
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      chapters,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createChapter(chapterData: Partial<Chapter>): Promise<Chapter> {
    const highestPositionChapter = await this.repository
      .createQueryBuilder("chapter")
      .where("chapter.courseId = :courseId", { courseId: chapterData.courseId })
      .where("chapter.moduleId = :moduleId", { moduleId: chapterData.moduleId })
      .orderBy("chapter.position", "DESC")
      .getOne();

    const highestPosition = highestPositionChapter?.position ?? 0;
    chapterData.position = highestPosition + 1;

    return this.create(chapterData);
  }

  async updateChapter(
    id: number,
    chapterData: Partial<Chapter>
  ): Promise<Chapter | null> {
    const cleanedData = Object.fromEntries(
      Object.entries(chapterData).filter(([_, value]) => value !== undefined)
    );

    return this.update(id, cleanedData);
  }

  async archiveChapter(id: number): Promise<Chapter | null> {
    return this.updateChapter(id, { status: ECourseStatus.ARCHIVED });
  }

  async updateChapterPositions(
    positions: TUpdatePositionArray,
    courseId: number,
    moduleId: number
  ): Promise<void> {
    const values = positions
      .map(({ id, position }) => `(${id}, ${position})`)
      .join(", ");

    const query = `
      UPDATE chapter   
      SET position = temp.new_position 
      FROM (VALUES ${values}) AS temp(chapter_id, new_position) 
      WHERE chapter.id = temp.chapter_id AND chapter."courseId" = ${courseId}
      AND chapter."moduleId" = ${moduleId}
    `;

    await this.repository.query(query);
  }
}

export const chapterService = new ChapterService();
