import { ECourseStatus, EEnrollmentStatus } from "@packages/definitions";
import { LearnerActivity } from "../../entity/learningProgress/learnerActivity";
import {
  ChapterRepository,
  CourseEnrollmentRepository,
  LearnerActivityRepository,
  LearnerProgressRepository,
  ModuleRepository,
} from "../../repository";
import { BaseService } from "../common/base";

export class LearnerActivityService extends BaseService<LearnerActivity> {
  constructor() {
    super(LearnerActivityRepository);
  }

  async getLearnerActiveCoursesWithProgress(userId: number) {
    const coursesWithProgress =
      await CourseEnrollmentRepository.createQueryBuilder("enrollment")
        .leftJoinAndSelect("enrollment.course", "course")
        .addSelect((subQuery) => {
          return subQuery
            .select("COUNT(lesson.id)", "totalLessons")
            .from("Lesson", "lesson")
            .where("lesson.courseId = enrollment.courseId")
            .andWhere("lesson.status = :lessonStatus", {
              lessonStatus: ECourseStatus.PUBLISHED,
            });
        }, "totalLessons")
        .addSelect((subQuery) => {
          return subQuery
            .select("COUNT(activity.id)", "completedLessons")
            .from("LearnerActivity", "activity")
            .where("activity.courseId = enrollment.courseId")
            .andWhere("activity.userId = :userId", { userId });
        }, "completedLessons")
        .addSelect((subQuery) => {
          return subQuery
            .select("COALESCE(SUM(activity.xpEarned), 0)", "totalXpEarned")
            .from("LearnerActivity", "activity")
            .where("activity.courseId = enrollment.courseId")
            .andWhere("activity.userId = :userId", { userId });
        }, "totalXpEarned")
        .where("enrollment.userId = :userId", { userId })
        .andWhere("enrollment.status = :enrollmentStatus", {
          enrollmentStatus: EEnrollmentStatus.ACTIVE,
        })
        .cache(30000)
        .getRawMany();

    // Get learner progress for all enrolled courses
    const courseIds = coursesWithProgress.map(
      (data) => data.enrollment_courseId
    );
    const learnerProgressList = await LearnerProgressRepository.find({
      where:
        courseIds.length > 0
          ? courseIds.map((courseId) => ({ userId, courseId }))
          : [],
      select: ["courseId", "moduleId", "chapterId", "lessonId"],
    });

    return coursesWithProgress.map((data) => {
      const totalLessons = parseInt(data.totalLessons, 10) || 0;
      const completedLessons = parseInt(data.completedLessons, 10) || 0;
      const totalXpEarned = parseInt(data.totalXpEarned, 10) || 0;

      // Find learnerProgress for this course
      const progressInfo = learnerProgressList.find(
        (p) => p.courseId === data.enrollment_courseId
      );

      return {
        courseId: data.enrollment_courseId,
        course: {
          id: data.course_id,
          name: data.course_name,
          description: data.course_description,
          imageUrl: data.course_imageUrl,
          enrollLink: data.course_enrollLink,
          price: data.course_price,
        },
        progress: {
          totalLessons,
          completedLessons,
          progressPercentage:
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0,
          totalXpEarned,
        },
        learnerProgress: progressInfo
          ? {
              moduleId: progressInfo.moduleId,
              chapterId: progressInfo.chapterId,
              lessonId: progressInfo.lessonId,
            }
          : null,
      };
    });
  }

  async getLearnerModulesWithProgress(userId: number, courseId: number) {
    const enrollment = await CourseEnrollmentRepository.findOne({
      where: { userId, courseId, status: EEnrollmentStatus.ACTIVE },
    });

    if (!enrollment) throw new Error("You are not enrolled in this course");

    const currentModuleId = await LearnerProgressRepository.findOne({
      where: { userId, courseId },
      select: ["moduleId"],
    });

    const modulesWithProgress = await ModuleRepository.createQueryBuilder(
      "module"
    )
      .innerJoin("module.course", "course")
      .innerJoin(
        "lesson",
        "lesson",
        "lesson.moduleId = module.id AND lesson.status = :lessonStatus",
        {
          lessonStatus: ECourseStatus.PUBLISHED,
        }
      )
      .addSelect("course.name", "courseName")
      .addSelect("course.id", "courseId")
      .addSelect((subQuery) => {
        return subQuery
          .select("COUNT(lesson.id)", "totalLessons")
          .from("Lesson", "lesson")
          .where("lesson.moduleId = module.id")
          .andWhere("lesson.status = :lessonStatus", {
            lessonStatus: ECourseStatus.PUBLISHED,
          });
      }, "totalLessons")
      .addSelect((subQuery) => {
        return subQuery
          .select("COUNT(activity.id)", "completedLessons")
          .from("LearnerActivity", "activity")
          .where("activity.moduleId = module.id")
          .andWhere("activity.userId = :userId", { userId });
      }, "completedLessons")
      .addSelect((subQuery) => {
        return subQuery
          .select("COALESCE(SUM(activity.xpEarned), 0)", "totalXpEarned")
          .from("LearnerActivity", "activity")
          .where("activity.moduleId = module.id")
          .andWhere("activity.userId = :userId", { userId });
      }, "totalXpEarned")
      .where("module.courseId = :courseId", { courseId })
      .groupBy("module.id, course.id, course.name")
      .having("COUNT(lesson.id) > 0") // Only include modules that have lessons
      .orderBy("module.position", "ASC")
      .cache(30000) // 30 second query cache at DB level
      .getRawMany();

    return modulesWithProgress.map((data: any) => {
      const totalLessons = parseInt(data.totalLessons, 10) || 0;
      const completedLessons = parseInt(data.completedLessons, 10) || 0;
      const totalXpEarned = parseInt(data.totalXpEarned, 10) || 0;
      return {
        id: data.module_id,
        name: data.module_name,
        description: data.module_description,
        iconName: data.module_iconName,
        position: data.module_position,
        status: data.module_status,
        createdAt: data.module_createdAt,
        course: { id: data.courseId, name: data.courseName },
        isCurrent: currentModuleId?.moduleId === Number(data.module_id),
        progress: {
          totalLessons,
          completedLessons,
          progressPercentage:
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0,
          totalXpEarned,
        },
      };
    });
  }

  async getLearnerChaptersWithProgress(
    userId: number,
    courseId: number,
    moduleId: number
  ) {
    const enrollment = await CourseEnrollmentRepository.findOne({
      where: { userId, courseId, status: EEnrollmentStatus.ACTIVE },
    });

    if (!enrollment) throw new Error("You are not enrolled in this course");

    const currentChapter = await LearnerProgressRepository.findOne({
      where: { userId, courseId },
      select: ["chapterId"],
    });

    const chaptersWithProgress = await ChapterRepository.createQueryBuilder(
      "chapter"
    )
      .innerJoin("chapter.module", "module")
      .innerJoin(
        "lesson",
        "lesson",
        "lesson.chapterId = chapter.id AND lesson.status = :lessonStatus",
        {
          lessonStatus: ECourseStatus.PUBLISHED,
        }
      )
      .addSelect("module.id", "moduleId")
      .addSelect("module.name", "moduleName")
      .addSelect((subQuery) => {
        return subQuery
          .select("COUNT(lesson.id)", "totalLessons")
          .from("Lesson", "lesson")
          .where("lesson.chapterId = chapter.id")
          .andWhere("lesson.status = :lessonStatus", {
            lessonStatus: ECourseStatus.PUBLISHED,
          });
      }, "totalLessons")
      .addSelect((subQuery) => {
        return subQuery
          .select("COUNT(activity.id)", "completedLessons")
          .from("LearnerActivity", "activity")
          .where("activity.chapterId = chapter.id")
          .andWhere("activity.userId = :userId", { userId });
      }, "completedLessons")
      .addSelect((subQuery) => {
        return subQuery
          .select("COALESCE(SUM(activity.xpEarned), 0)", "totalXpEarned")
          .from("LearnerActivity", "activity")
          .where("activity.chapterId = chapter.id")
          .andWhere("activity.userId = :userId", { userId });
      }, "totalXpEarned")
      .where("chapter.moduleId = :moduleId AND chapter.courseId = :courseId", {
        moduleId,
        courseId,
      })
      .groupBy("chapter.id, module.id, module.name")
      .having("COUNT(lesson.id) > 0") // Only include chapters that have lessons
      .orderBy("chapter.position", "ASC")
      .cache(30000) // 30 second query cache at DB level
      .getRawMany();

    return chaptersWithProgress.map((data: any) => {
      const totalLessons = parseInt(data.totalLessons, 10) || 0;
      const completedLessons = parseInt(data.completedLessons, 10) || 0;
      const totalXpEarned = parseInt(data.totalXpEarned, 10) || 0;

      return {
        id: data.chapter_id,
        name: data.chapter_name,
        description: data.chapter_description,
        position: data.chapter_position,
        status: data.chapter_status,
        createdAt: data.chapter_createdAt,
        module: {
          id: data.moduleId,
          name: data.moduleName,
        },
        isCurrent: currentChapter?.chapterId === Number(data.chapter_id),
        progress: {
          totalLessons,
          completedLessons,
          progressPercentage:
            totalLessons > 0
              ? Math.round((completedLessons / totalLessons) * 100)
              : 0,
          totalXpEarned,
        },
      };
    });
  }
}

export const learnerActivityService = new LearnerActivityService();
