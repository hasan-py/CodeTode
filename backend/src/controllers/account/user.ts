import { Request, Response } from "express";
import { userService } from "../../services/account/user";
import { sendError, sendSuccess } from "../../utils/response";
import { catchErrors } from "../../decorators/catchErrors";

export class UserController {
  @catchErrors()
  async getUserProfile(req: Request, res: Response) {
    const userId = req.user.userId;

    const user = await userService.getUserProfile(userId);

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    sendSuccess(res, user);
  }

  @catchErrors()
  async updateUserProfile(req: Request, res: Response) {
    const updatedUser = await userService.updateUserProfile({
      id: req.body.id,
      name: req.body.name,
      imageUrl: req.body.imageUrl,
    });

    if (!updatedUser) {
      sendError(res, "User not found", 404);
      return;
    }

    sendSuccess(res, updatedUser);
  }

  @catchErrors("Failed to retrieve users")
  async getAllActiveLearner(req: Request, res: Response) {
    const users = await userService.getAllActiveLearner();
    sendSuccess(res, users);
  }
}
