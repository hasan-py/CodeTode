import { ECourseStatus, EEnrollmentStatus } from "@packages/definitions";
import { LearnerActivity } from "../../entity/learningProgress/learnerActivity";
import {
  CourseEnrollmentRepository,
  LearnerActivityRepository,
  LearnerProgressRepository,
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
}

export const learnerActivityService = new LearnerActivityService();
