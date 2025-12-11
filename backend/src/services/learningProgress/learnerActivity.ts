import { ECourseStatus, EEnrollmentStatus } from "@packages/definitions";
import { LearnerActivity } from "../../entity/learningProgress/learnerActivity";
import {
  ChapterRepository,
  CourseEnrollmentRepository,
  LearnerActivityRepository,
  LearnerProgressRepository,
  LessonRepository,
  ModuleRepository,
} from "../../repository";
import { BaseService } from "../common/base";
import { markdownService } from "../course/markdown";

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

  async getLearnerCurrentLesson(
    userId: number,
    courseId: number,
    moduleId: number,
    chapterId: number
  ) {
    // Check if user is enrolled in this course
    const enrollment = await CourseEnrollmentRepository.findOne({
      where: { userId, courseId, status: EEnrollmentStatus.ACTIVE },
    });

    if (!enrollment) {
      throw new Error("You are not enrolled in this course");
    }

    // Get current lesson from cache or find first incomplete lesson in the chapter
    let currentLessonId = await LearnerProgressRepository.findOne({
      where: { userId, courseId },
      select: ["lessonId"],
    });

    let lessonId: number;
    if (!currentLessonId) {
      const firstLesson = await LessonRepository.createQueryBuilder("lesson")
        .select("lesson.id")
        .where(
          "lesson.chapterId = :chapterId AND lesson.moduleId = :moduleId AND lesson.courseId = :courseId AND lesson.status = :lessonStatus",
          {
            chapterId,
            moduleId,
            courseId,
            lessonStatus: ECourseStatus.PUBLISHED,
          }
        )
        .orderBy("lesson.position", "ASC")
        .limit(1)
        .getRawOne();

      if (!firstLesson) {
        throw new Error("No lessons found in this chapter");
      }
      lessonId = Number(firstLesson.lesson_id);
    } else {
      lessonId = currentLessonId.lessonId;
    }

    // Get lesson details with all related data in single query
    const lessonData = await LessonRepository.createQueryBuilder("lesson")
      .innerJoin("course", "course", "course.id = lesson.courseId")
      .innerJoin("module", "module", "module.id = lesson.moduleId")
      .innerJoin("chapter", "chapter", "chapter.id = lesson.chapterId")
      .leftJoin(
        "lesson_content_link",
        "contentLinks",
        "contentLinks.lessonId = lesson.id"
      )
      .leftJoin("quiz", "quizzes", "quizzes.lessonId = lesson.id")
      .leftJoin("quiz_option", "quizOptions", "quizOptions.quizId = quizzes.id")
      .leftJoin(
        "learner_activity",
        "activity",
        "activity.lessonId = lesson.id AND activity.userId = :userId",
        { userId }
      )
      .select([
        // Lesson details
        "lesson.id as id",
        "lesson.name as name",
        "lesson.description as description",
        "lesson.position as position",
        "lesson.status as status",
        "lesson.xpPoints as xpPoints",
        "lesson.type as type",
        "lesson.createdAt as createdAt",
        "lesson.courseId as courseId",
        "lesson.moduleId as moduleId",
        "lesson.chapterId as chapterId",
        // Related entity names
        "course.name as courseName",
        "module.name as moduleName",
        "chapter.name as chapterName",
        // Progress data
        "CASE WHEN activity.id IS NOT NULL THEN true ELSE false END as isCompleted",
        "activity.xpEarned as xpEarned",
        "activity.createdAt as completedAt",
        // Content links
        "contentLinks.id as contentLinkId",
        "contentLinks.title as contentLinkTitle",
        "contentLinks.url as contentLinkUrl",
        "contentLinks.linkType as contentLinkType",
        "contentLinks.position as contentLinkPosition",
        // Quiz data
        "quizzes.id as quizId",
        "quizzes.question as quizQuestion",
        "quizzes.explanation as quizExplanation",
        "quizzes.position as quizPosition",
        "quizOptions.id as optionId",
        "quizOptions.text as optionText",
        "quizOptions.isCorrect as optionIsCorrect",
        "quizOptions.position as optionPosition",
      ])
      .where("lesson.id = :lessonId", { lessonId })
      .getRawMany();

    if (!lessonData || lessonData.length === 0) {
      throw new Error("Lesson not found");
    }

    const lesson = lessonData[0];

    // Check if lesson is unlocked
    const isUnlocked = await this.isLessonUnlocked(userId, lesson.id);

    // Get navigation lessons (previous and next) and chapter progress
    const [previousLesson, nextLesson, chapterProgress] = await Promise.all([
      // Previous lesson
      LessonRepository.createQueryBuilder("lesson")
        .select([
          "lesson.id as id",
          "lesson.name as name",
          "lesson.position as position",
        ])
        .where(
          "lesson.chapterId = :chapterId AND lesson.position < :position",
          {
            chapterId: lesson.chapterid,
            position: lesson.position,
          }
        )
        .orderBy("lesson.position", "DESC")
        .limit(1)
        .getRawOne(),
      // Next lesson
      LessonRepository.createQueryBuilder("lesson")
        .select([
          "lesson.id as id",
          "lesson.name as name",
          "lesson.position as position",
        ])
        .where(
          "lesson.chapterId = :chapterId AND lesson.position > :position",
          {
            chapterId: lesson.chapterid,
            position: lesson.position,
          }
        )
        .orderBy("lesson.position", "ASC")
        .limit(1)
        .getRawOne(),
      // Chapter progress
      LessonRepository.createQueryBuilder("lesson")
        .select([
          "COUNT(lesson.id) as totalLessons",
          "COUNT(activity.id) as completedLessons",
          "COALESCE(SUM(activity.xpEarned), 0) as totalXpEarned",
        ])
        .leftJoin(
          "learner_activity",
          "activity",
          "activity.lessonId = lesson.id AND activity.userId = :userId",
          { userId }
        )
        .where(
          "lesson.chapterId = :chapterId AND lesson.status = :lessonStatus",
          {
            chapterId: lesson.chapterid,
            lessonStatus: ECourseStatus.PUBLISHED,
          }
        )
        .getRawOne(),
    ]);

    // Group content links and quizzes
    const contentLinksData = lessonData
      .filter((row) => row.contentlinkid)
      .map((row) => ({
        id: Number(row.contentlinkid) || 0,
        title: row.contentlinktitle,
        url: row.contentlinkurl,
        linkType: row.contentlinklinktype,
        position: Number(row.contentlinkposition) || 0,
      }))
      .filter(
        (link, index, self) => self.findIndex((l) => l.id === link.id) === index
      )
      .sort((a, b) => a.position - b.position);

    const contentLinks = await Promise.allSettled(
      contentLinksData.map(async (link) => {
        let content = null;

        if (link.url && link.url.endsWith(".md")) {
          content = await this.getMarkdownLessonContent(link.url);
        }

        return {
          ...link,
          content,
        };
      })
    ).then((results) =>
      results
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === "fulfilled"
        )
        .map((result) => result.value)
    );

    const quizzesMap = new Map();
    lessonData.forEach((row) => {
      if (row.quizid) {
        if (!quizzesMap.has(row.quizid)) {
          quizzesMap.set(row.quizid, {
            id: Number(row.quizid) || 0,
            question: row.quizquestion,
            explanation: row.quizexplanation,
            position: Number(row.quizposition) || 0,
            options: [],
          });
        }
        if (row.optionid) {
          quizzesMap.get(row.quizid).options.push({
            id: Number(row.optionid) || 0,
            text: row.optiontext,
            isCorrect: row.optioniscorrect,
            position: Number(row.optionposition) || 0,
          });
        }
      }
    });

    // Sort quizzes and their options by position
    const quizzes = Array.from(quizzesMap.values())
      .sort((a, b) => a.position - b.position)
      .map((quiz) => ({
        ...quiz,
        options: quiz.options.sort((a: any, b: any) => a.position - b.position),
      }));

    return {
      lesson: {
        id: Number(lesson.id) || 0,
        name: lesson.name,
        description: lesson.description,
        position: Number(lesson.position) || 0,
        status: lesson.status,
        xpPoints: Number(lesson.xppoints) || 0,
        type: lesson.type,
        createdAt: lesson.createdat,
        courseId: Number(lesson.courseid) || 0,
        moduleId: Number(lesson.moduleid) || 0,
        chapterId: Number(lesson.chapterid) || 0,
        courseName: lesson.coursename,
        moduleName: lesson.modulename,
        chapterName: lesson.chaptername,
        isCompleted: lesson.iscompleted,
        isUnlocked,
        xpEarned: lesson.xpearned ? Number(lesson.xpearned) || 0 : null,
        completedAt: lesson.completedat || null,
        contentLinks,
        quizzes,
      },
      navigation: {
        previousLesson: previousLesson
          ? {
              id: Number(previousLesson.id) || 0,
              name: previousLesson.name,
              position: Number(previousLesson.position) || 0,
            }
          : null,
        nextLesson: nextLesson
          ? {
              id: Number(nextLesson.id) || 0,
              name: nextLesson.name,
              position: Number(nextLesson.position) || 0,
            }
          : null,
      },
      progress: {
        totalLessons: Number(chapterProgress.totallessons) || 0,
        completedLessons: Number(chapterProgress.completedlessons) || 0,
        progressPercentage:
          Number(chapterProgress.totallessons) > 0
            ? Math.round(
                (Number(chapterProgress.completedlessons) /
                  Number(chapterProgress.totallessons)) *
                  100
              )
            : 0,
        totalXpEarned: Number(chapterProgress.totalxpearned) || 0,
      },
    };
  }

  private async isLessonUnlocked(
    userId: number,
    lessonId: number
  ): Promise<boolean> {
    // Optimized query to check unlock status
    const unlockStatus = await LessonRepository.createQueryBuilder("lesson")
      .leftJoin(
        "lesson",
        "previousLesson",
        "previousLesson.chapterId = lesson.chapterId AND previousLesson.position < lesson.position"
      )
      .leftJoin(
        "learner_activity",
        "completion",
        "completion.lessonId = previousLesson.id AND completion.userId = :userId"
      )
      .select([
        "lesson.id as currentLessonId",
        "previousLesson.id as previousLessonId",
        "completion.id as completionId",
      ])
      .where("lesson.id = :lessonId", { lessonId })
      .setParameter("userId", userId)
      .orderBy("previousLesson.position", "DESC")
      .limit(1)
      .getRawOne();

    // If no previous lesson or previous lesson is completed, it's unlocked
    const isUnlocked =
      !unlockStatus?.previousLessonId || !!unlockStatus?.completionId;

    return isUnlocked;
  }

  private async getMarkdownLessonContent(url: string): Promise<string | null> {
    try {
      const content = await markdownService.getMarkdownLessonContent(url);
      return content;
    } catch (error) {
      console.error(`Failed to fetch markdown content for ${url}:`, error);
      return null;
    }
  }
}

export const learnerActivityService = new LearnerActivityService();
