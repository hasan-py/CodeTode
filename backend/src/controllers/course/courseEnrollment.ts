import { EUserRole } from "@packages/definitions";
import { Logger } from "@packages/logger";
import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { courseEnrollmentService } from "../../services/course/courseEnrollment";
import { sendSuccess } from "../../utils/response";
import { CustomRequest } from "../../config/rawBody";

export class CourseEnrollmentController {
  @catchErrors()
  async webHookNewEnrollment(req: Request, res: Response) {
    const rawBody = (req as CustomRequest)?.rawBody;
    const signature = req.get("X-Signature") || "";

    await courseEnrollmentService.verifySignature(rawBody, signature);

    await courseEnrollmentService.enrollNewCourse(req.body);

    Logger.info(
      "Webhook received successfully and new course enrolled for user: ",
      req.body?.meta?.custom_data?.userId
    );

    sendSuccess(res, "Webhook received successfully");
  }

  @catchErrors()
  async getUserEnrolledCourses(req: Request, res: Response) {
    const userId =
      req?.user?.role === EUserRole.ADMIN ? undefined : req?.user?.userId;

    const courses = await courseEnrollmentService.getUserEnrolledCourses(
      userId
    );
    sendSuccess(res, courses);
  }

  @catchErrors()
  async getStatisticsData(req: Request, res: Response) {
    const statistics = await courseEnrollmentService.statisticsData();
    sendSuccess(res, statistics);
  }
}

export const courseEnrollmentController = new CourseEnrollmentController();
