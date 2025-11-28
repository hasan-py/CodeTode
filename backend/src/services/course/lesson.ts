import { ECourseStatus, type ILessonFilters } from "@packages/definitions";
import { Lesson } from "../../entity/course/lesson";
import { LessonRepository } from "../../repository";
import { BaseService } from "../common/base";

export class LessonService extends BaseService<Lesson> {
  constructor() {
    super(LessonRepository);
  }

  async listLessons(options: ILessonFilters = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      courseId,
      moduleId,
      chapterId,
    } = options;
    const offset = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder("lesson")
      .leftJoinAndSelect("lesson.course", "course")
      .leftJoinAndSelect("lesson.module", "module")
      .leftJoinAndSelect("lesson.chapter", "chapter")
      .leftJoinAndSelect("lesson.quizzes", "quizzes")
      .leftJoinAndSelect("quizzes.options", "quizOptions")
      .leftJoinAndSelect("lesson.contentLinks", "contentLinks");

    if (status) {
      queryBuilder.andWhere("lesson.status = :status", { status });
    }

    if (type) {
      queryBuilder.andWhere("lesson.type = :type", { type });
    }

    if (courseId) {
      queryBuilder.andWhere("lesson.courseId = :courseId", { courseId });
    }

    if (moduleId) {
      queryBuilder.andWhere("lesson.moduleId = :moduleId", { moduleId });
    }

    if (chapterId) {
      queryBuilder.andWhere("lesson.chapterId = :chapterId", { chapterId });
    }

    const [lessons, total] = await queryBuilder
      .orderBy("lesson.position", "ASC")
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      lessons,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createLesson(data: Partial<Lesson>) {
    const highestPositionLesson = await this.repository
      .createQueryBuilder("lesson")
      .where("lesson.courseId = :courseId", { courseId: data.courseId })
      .andWhere("lesson.moduleId = :moduleId", { moduleId: data.moduleId })
      .andWhere("lesson.chapterId = :chapterId", { chapterId: data.chapterId })
      .orderBy("lesson.position", "DESC")
      .getOne();

    const highestPosition = highestPositionLesson?.position ?? 0;
    data.position = highestPosition + 1;

    return this.create(data);
  }

  async updateLesson(
    id: number,
    lessonData: Partial<Lesson>
  ): Promise<Lesson | null> {
    const cleanedData = Object.fromEntries(
      Object.entries(lessonData).filter(([_, value]) => value !== undefined)
    );

    return this.update(id, cleanedData);
  }

  async archiveLesson(id: number): Promise<Lesson | null> {
    return this.updateLesson(id, { status: ECourseStatus.ARCHIVED });
  }

  async updateLessonPositions(
    positions: { id: number; position: number }[],
    {
      courseId,
      moduleId,
      chapterId,
    }: {
      courseId: number;
      moduleId: number;
      chapterId: number;
    }
  ): Promise<void> {
    const values = positions
      ?.map(({ id, position }) => `(${id}, ${position})`)
      .join(", ");

    await this.repository.query(
      `
      UPDATE lesson
      SET position = temp.new_position
      FROM (VALUES ${values}) AS temp(lesson_id, new_position)
      WHERE lesson.id = temp.lesson_id
        AND lesson."courseId" = $1
        AND lesson."moduleId" = $2
        AND lesson."chapterId" = $3
    `,
      [courseId, moduleId, chapterId]
    );
  }
}

export const lessonService = new LessonService();
