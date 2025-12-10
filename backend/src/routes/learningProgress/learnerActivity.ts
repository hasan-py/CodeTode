import { Router } from "express";
import { LearnerActivityController } from "../../controllers/learningProgress/learnerActivity";

class LearnerActivityRoutes {
  router: Router;
  learnerActivityController: LearnerActivityController;

  constructor() {
    this.router = Router();
    this.learnerActivityController = new LearnerActivityController();
    this.routes();
  }

  routes() {
    const { getLearnerActiveCoursesWithProgress } =
      this.learnerActivityController;

    this.router.get("/courses", getLearnerActiveCoursesWithProgress);
  }
}

export const LearnerActivityRouter = new LearnerActivityRoutes().router;
