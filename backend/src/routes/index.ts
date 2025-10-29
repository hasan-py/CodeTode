import { Logger } from "@packages/logger";
import express, { Request, Response } from "express";
import { UserRouter } from "./account/user";
import { AuthRouter } from "./account/auth";
import { authenticateAdmin, authenticateJwt } from "../ middleware/auth";
import { CourseRouter } from "./course/course";

export class Routes {
  static Endpoints(app: express.Application) {
    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.use(`/api/profile`, authenticateJwt, UserRouter);
    app.use(`/api/auth`, AuthRouter);

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

  static adminEndpoints(app: express.Application) {
    app.use(`/api/admin/course`, authenticateAdmin, CourseRouter);
  }
}
