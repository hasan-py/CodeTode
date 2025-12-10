import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { learnerActivityService } from "../../services/learningProgress/learnerActivity";
import { sendSuccess } from "../../utils/response";

export class LearnerActivityController {
  @catchErrors()
  async getLearnerActiveCoursesWithProgress(req: Request, res: Response) {
    const userId = +req.user.userId;
    const coursesWithProgress =
      await learnerActivityService.getLearnerActiveCoursesWithProgress(userId);

    sendSuccess(res, coursesWithProgress);
  }
}
