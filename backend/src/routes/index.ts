import { Logger } from "@packages/logger";
import express, { Request, Response } from "express";
import { AdminUserRouter, UserRouter } from "./account/user";
import { AuthRouter } from "./account/auth";
import {
  authenticateAdmin,
  authenticateJwt,
  authenticateLearner,
} from "../ middleware/auth";
import { CoursePublicRouter, CourseRouter } from "./course/course";
import { LemonSqueezyRouter } from "./course/lemonSqueezyProduct";
import { ModuleRouter } from "./course/module";
import { ChapterRouter } from "./course/chapter";
import { LessonRouter } from "./course/lesson";
import {
  CourseEnrollmentRouter,
  LearnerCourseEnrollmentRouter,
} from "./course/courseEnrollment";
import {
  LearnerActivityPublicRouter,
  LearnerActivityRouter,
} from "./learningProgress/learnerActivity";

export class Routes {
  static Endpoints(app: express.Application) {
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.use(`/api/profile`, authenticateJwt, UserRouter);
    app.use(`/api/auth`, AuthRouter);

    this.publicEndpoints(app);
    this.learnerEndpoints(app);
    this.adminEndpoints(app);

    app.use((req: Request, res: Response) => {
      Logger.error("404 Not found!");
      res.status(404).send("404 Not found!");
    });

    app.use((err: Error, req: Request, res: Response) => {
      Logger.error(err.stack);

      res.status(500).send({
        message: err.message || "An unexpected error occurred",
      });
    });
  }

  static publicEndpoints(app: express.Application) {
    app.use(`/api/course`, CoursePublicRouter);
    app.use(`/webhooks/enrollment`, CourseEnrollmentRouter);
    app.use("/api/public/learner", LearnerActivityPublicRouter);
  }

  static learnerEndpoints(app: express.Application) {
    app.use(`/api/learner/enrollment`, LearnerCourseEnrollmentRouter);
    app.use(
      `/api/learner/activity`,
      authenticateLearner,
      LearnerActivityRouter
    );
  }

  static adminEndpoints(app: express.Application) {
    app.use(`/api/admin/course`, authenticateAdmin, CourseRouter);
    app.use(`/api/admin/products`, authenticateAdmin, LemonSqueezyRouter);
    app.use(`/api/admin/module`, authenticateAdmin, ModuleRouter);
    app.use(`/api/admin/chapter`, authenticateAdmin, ChapterRouter);
    app.use(`/api/admin/lesson`, authenticateAdmin, LessonRouter);
    app.use(`/api/admin/user`, authenticateAdmin, AdminUserRouter);
    app.use(
      `/api/admin/learner-enrollment`,
      authenticateAdmin,
      LearnerCourseEnrollmentRouter
    );
  }
}
