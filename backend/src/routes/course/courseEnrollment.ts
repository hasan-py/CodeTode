import { Router } from "express";
import { CourseEnrollmentController } from "../../controllers/course/courseEnrollment";

export class CourseEnrollmentRoutes {
  router: Router;
  learnerEnrollmentRouter: Router;
  courseEnrollmentController: CourseEnrollmentController;

  constructor() {
    this.router = Router();
    this.learnerEnrollmentRouter = Router();
    this.courseEnrollmentController = new CourseEnrollmentController();
    this.routes();
    this.learnerRoutes();
  }

  learnerRoutes() {
    const { getUserEnrolledCourses } = this.courseEnrollmentController;

    this.learnerEnrollmentRouter.get("/courses", getUserEnrolledCourses);
  }

  routes() {
    const { webHookNewEnrollment } = this.courseEnrollmentController;

    this.router.post("/new-enrollment", webHookNewEnrollment);
  }
}

export const CourseEnrollmentRouter = new CourseEnrollmentRoutes().router;
export const LearnerCourseEnrollmentRouter = new CourseEnrollmentRoutes()
  .learnerEnrollmentRouter;
