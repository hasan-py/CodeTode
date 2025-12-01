import {
  SCourseCreate,
  SIdParams,
  SPaginationQuery,
  SUpdatePositions,
} from "@packages/definitions";
import { Router } from "express";
import { validator } from "../../ middleware/validator";
import { CourseController } from "../../controllers/course/course";

class CourseRoutes {
  router: Router;
  courseController: CourseController;
  publicRouter: Router;

  constructor() {
    this.router = Router();
    this.publicRouter = Router();
    this.courseController = new CourseController();
    this.adminRoutes();
    this.publicRoutes();
  }

  adminRoutes() {
    const {
      getCourses,
      getCourse,
      createCourse,
      updateCourse,
      archiveCourse,
      updateCoursePositions,
    } = this.courseController;

    this.router.get("/", validator({ query: SPaginationQuery }), getCourses);

    this.router.post("/", validator({ body: SCourseCreate }), createCourse);

    this.router.put(
      "/positions",
      validator({ body: SUpdatePositions }),
      updateCoursePositions
    );

    this.router.get("/:id", validator({ params: SIdParams }), getCourse);

    this.router.put(
      "/:id",
      validator({ params: SIdParams, body: SCourseCreate }),
      updateCourse
    );

    this.router.post(
      "/:id/archive",
      validator({ params: SIdParams }),
      archiveCourse
    );
  }

  publicRoutes() {
    const { getPublicCourses, getPublicCourse } = this.courseController;
    this.publicRouter.get(
      "/published",
      validator({ query: SPaginationQuery }),
      getPublicCourses
    );

    this.publicRouter.get(
      "/:id",
      validator({ params: SIdParams }),
      getPublicCourse
    );
  }
}

export const CourseRouter = new CourseRoutes().router;
export const CoursePublicRouter = new CourseRoutes().publicRouter;
