import { Router } from "express";
import { LearnerActivityController } from "../../controllers/learningProgress/learnerActivity";
import { validator } from "../../ middleware/validator";
import {
  SIdParams,
  SLearnerChaptersParams,
  SLearnerLessonsParams,
  SLearnerModulesParams,
} from "@packages/definitions";

class LearnerActivityRoutes {
  router: Router;
  publicRouter: Router;

  learnerActivityController: LearnerActivityController;

  constructor() {
    this.router = Router();
    this.publicRouter = Router();
    this.learnerActivityController = new LearnerActivityController();
    this.publicRoutes();
  }

  publicRoutes() {
    const { getLeaderboard } = this.learnerActivityController;
    this.publicRouter.get("/leaderboard", getLeaderboard);
  }

  routes() {
    const {
      getLearnerActiveCoursesWithProgress,
      getLearnerModulesWithProgress,
      getLearnerChaptersWithProgress,
      getLearnerCurrentLesson,
      completeLesson,
      getCompletedLessonsForChapter,
      getLearnerAccessibleLesson,
      getLearnerActivityGraph,
    } = this.learnerActivityController;

    this.router.get("/courses", getLearnerActiveCoursesWithProgress);

    this.router.get("/activity-graph", getLearnerActivityGraph);

    this.router.get(
      "/accessible-lesson/:id",
      validator({ params: SIdParams }), // lessonId
      getLearnerAccessibleLesson
    );

    this.router.post(
      "/complete-lesson/:id",
      validator({ params: SIdParams }), // lesson
      completeLesson
    );

    this.router.get(
      "/completed-lessons/:id",
      validator({ params: SIdParams }), // chapterId
      getCompletedLessonsForChapter
    );

    this.router.get(
      "/:courseId/modules",
      validator({ params: SLearnerModulesParams }),
      getLearnerModulesWithProgress
    );
    this.router.get(
      "/:courseId/modules/:moduleId/chapters",
      validator({ params: SLearnerChaptersParams }),
      getLearnerChaptersWithProgress
    );
    this.router.get(
      "/:courseId/modules/:moduleId/chapters/:chapterId/current-lesson",
      validator({ params: SLearnerLessonsParams }),
      getLearnerCurrentLesson
    );
  }
}

export const LearnerActivityRouter = new LearnerActivityRoutes().router;
export const LearnerActivityPublicRouter = new LearnerActivityRoutes()
  .publicRouter;
