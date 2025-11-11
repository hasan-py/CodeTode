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

  constructor() {
    this.router = Router();
    this.courseController = new CourseController();
    this.adminRoutes();
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
}

export const CourseRouter = new CourseRoutes().router;
