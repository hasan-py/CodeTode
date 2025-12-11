import { Router } from "express";
import { LearnerActivityController } from "../../controllers/learningProgress/learnerActivity";
import { validator } from "../../ middleware/validator";
import {
  SLearnerChaptersParams,
  SLearnerModulesParams,
} from "@packages/definitions";

class LearnerActivityRoutes {
  router: Router;
  learnerActivityController: LearnerActivityController;

  constructor() {
    this.router = Router();
    this.learnerActivityController = new LearnerActivityController();
    this.routes();
  }

  routes() {
    const {
      getLearnerActiveCoursesWithProgress,
      getLearnerModulesWithProgress,
      getLearnerChaptersWithProgress,
    } = this.learnerActivityController;

    this.router.get("/courses", getLearnerActiveCoursesWithProgress);
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
  }
}

export const LearnerActivityRouter = new LearnerActivityRoutes().router;
