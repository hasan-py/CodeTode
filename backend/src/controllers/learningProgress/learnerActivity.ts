import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { learnerActivityService } from "../../services/learningProgress/learnerActivity";
import { sendSuccess } from "../../utils/response";
import { learnerStatisticsService } from "../../services/learningProgress/learnerStatistics";

export class LearnerActivityController {
  @catchErrors()
  async getLearnerActiveCoursesWithProgress(req: Request, res: Response) {
    const userId = +req.user.userId;
    const coursesWithProgress =
      await learnerActivityService.getLearnerActiveCoursesWithProgress(userId);

    sendSuccess(res, coursesWithProgress);
  }

  @catchErrors()
  async getLearnerModulesWithProgress(req: Request, res: Response) {
    const userId = +req.user.userId;
    const courseId = +req.params.courseId;

    const modulesWithProgress =
      await learnerActivityService.getLearnerModulesWithProgress(
        userId,
        courseId
      );
    sendSuccess(res, modulesWithProgress);
  }

  @catchErrors()
  async getLearnerChaptersWithProgress(req: Request, res: Response) {
    const userId = +req.user.userId;
    const courseId = +req.params.courseId;
    const moduleId = +req.params.moduleId;

    const chaptersWithProgress =
      await learnerActivityService.getLearnerChaptersWithProgress(
        userId,
        courseId,
        moduleId
      );
    sendSuccess(res, chaptersWithProgress);
  }

  @catchErrors()
  async getLearnerCurrentLesson(req: Request, res: Response) {
    const userId = +req.user.userId;
    const courseId = +req.params.courseId;
    const moduleId = +req.params.moduleId;
    const chapterId = +req.params.chapterId;

    const lessonsWithProgress =
      await learnerActivityService.getLearnerCurrentLesson(
        userId,
        courseId,
        moduleId,
        chapterId
      );
    sendSuccess(res, lessonsWithProgress);
  }

  @catchErrors()
  async completeLesson(req: Request, res: Response) {
    const userId = +req.user.userId;
    const lessonId = +req.params.id;

    const lessonCompletion = await learnerActivityService.completeLesson(
      userId,
      lessonId
    );
    sendSuccess(res, lessonCompletion);
  }

  @catchErrors()
  async getCompletedLessonsForChapter(req: Request, res: Response) {
    const userId = +req.user.userId;
    const chapterId = +req.params.id;

    const lessonCompleted =
      await learnerActivityService.getCompletedLessonsForChapter(
        userId,
        chapterId
      );
    sendSuccess(res, lessonCompleted);
  }

  @catchErrors()
  async getLearnerAccessibleLesson(req: Request, res: Response) {
    const userId = +req.user.userId;
    const lessonId = +req.params.id;

    const lesson = await learnerActivityService.getLearnerAccessibleLesson(
      userId,
      lessonId
    );
    sendSuccess(res, lesson);
  }

  @catchErrors()
  async getLearnerActivityGraph(req: Request, res: Response) {
    const userId = +req.user.userId;
    const year = +req.query.year || new Date().getFullYear();
    const activityGraph = await learnerActivityService.getLearnerActivityGraph(
      userId,
      year
    );
    sendSuccess(res, activityGraph);
  }

  @catchErrors()
  async getLeaderboard(req: Request, res: Response) {
    const leaderboard = await learnerStatisticsService.getLeaderboard();
    sendSuccess(res, leaderboard);
  }
}
