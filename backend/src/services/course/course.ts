import type { TUpdatePositionArray } from "@packages/definitions";
import {
  ECourseStatus,
  ICommonFilters,
  IPaginatedCourseResult,
} from "@packages/definitions";
import { Course } from "../../entity/course/course";
import { CourseRepository } from "../../repository";
import { BaseService } from "../common/base";

export class CourseService extends BaseService<Course> {
  constructor() {
    super(CourseRepository);
  }

  async listCourses(options: ICommonFilters = {}): Promise<
    Omit<IPaginatedCourseResult, "courses"> & {
      courses: Course[];
    }
  > {
    const { page = 1, limit = 10, status } = options;
    const offset = (page - 1) * limit;

    const queryBuilder = this.repository
      .createQueryBuilder("course")
      .select([
        "course.id",
        "course.name",
        "course.description",
        "course.imageUrl",
        "course.status",
        "course.price",
        "course.position",
        "course.enrollLink",
        "course.validityYear",
        "course.createdAt",
        "course.updatedAt",
      ])
      .loadRelationCountAndMap("course.moduleCount", "course.modules")
      .loadRelationCountAndMap("course.chapterCount", "course.chapters")
      .loadRelationCountAndMap("course.lessonCount", "course.lessons")
      .loadRelationCountAndMap("course.quizCount", "course.quizzes");

    if (status) {
      queryBuilder.where("course.status = :status", { status });
    }

    const [courses, total] = await queryBuilder
      .orderBy("course.position", "ASC")
      .skip(offset)
      .take(limit)
      .getManyAndCount();

    return {
      courses,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCourseById(id: number): Promise<Course | null> {
    return this.repository.findOne({
      where: { id, status: ECourseStatus.PUBLISHED },
    });
  }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    if (courseData.lemonSqueezyProductId) {
      const existing = await this.repository.findOne({
        where: { lemonSqueezyProductId: courseData.lemonSqueezyProductId },
      });
      if (existing) {
        throw new Error(
          `Course with the lemon squeezy product already exists.`
        );
      }
    }

    if (courseData.position === undefined) {
      const highestPositionCourse = await this.repository
        .createQueryBuilder("course")
        .orderBy("course.position", "DESC")
        .getOne();

      const highestPosition = highestPositionCourse?.position ?? 0;
      courseData.position = highestPosition + 1;
    }

    return this.create(courseData);
  }

  async updateCourse(
    id: number,
    courseData: Partial<Course>
  ): Promise<Course | null> {
    const cleanedData = Object.fromEntries(
      Object.entries(courseData).filter(([_, value]) => value !== undefined)
    );

    return this.update(id, cleanedData);
  }

  async archiveCourse(id: number): Promise<Course | null> {
    return this.updateCourse(id, { status: ECourseStatus.ARCHIVED });
  }

  async unarchiveCourse(
    id: number,
    newStatus: ECourseStatus = ECourseStatus.DRAFT
  ): Promise<Course | null> {
    if (newStatus === ECourseStatus.ARCHIVED) {
      throw new Error("Cannot unarchive to archived status");
    }
    return this.updateCourse(id, { status: newStatus });
  }

  async updateCoursePositions(positions: TUpdatePositionArray): Promise<void> {
    const values = positions
      .map(({ id, position }) => `(${id}, ${position})`)
      .join(", ");

    await this.repository.query(`
      UPDATE course 
      SET position = temp.new_position 
      FROM (VALUES ${values}) AS temp(course_id, new_position) 
      WHERE course.id = temp.course_id
    `);
  }

  async findCourseWithNestedRelations(
    id: number,
    relations: string[] = []
  ): Promise<
    | (Course & {
        chapterCount: number;
        lessonCount: number;
        quizCount: number;
      })
    | null
  > {
    const course = await this.repository.findOne({
      where: { id, status: ECourseStatus.PUBLISHED },
      relations:
        relations.length > 0
          ? relations
          : [
              "modules",
              "modules.chapters",
              "modules.chapters.lessons",
              "modules.chapters.lessons.quizzes",
              "modules.chapters.lessons.quizzes.options",
            ],
    });
    if (!course) return null;

    const queryBuilder = this.repository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.chapters", "chapter")
      .leftJoinAndSelect("course.lessons", "lesson")
      .leftJoinAndSelect("course.quizzes", "quiz")
      .where("course.id = :id", { id });

    const [result] = await queryBuilder
      .select(["course.id"])
      .addSelect("COUNT(DISTINCT chapter.id)", "chapterCount")
      .addSelect("COUNT(DISTINCT lesson.id)", "lessonCount")
      .addSelect("COUNT(DISTINCT quiz.id)", "quizCount")
      .groupBy("course.id")
      .getRawMany();

    return {
      ...course,
      chapterCount: Number(result?.chapterCount ?? 0),
      lessonCount: Number(result?.lessonCount ?? 0),
      quizCount: Number(result?.quizCount ?? 0),
    };
  }
}

export const courseService = new CourseService();
