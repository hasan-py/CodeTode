import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { authService } from "../../services/account/auth";
import { sendSuccess } from "../../utils/response";

export class AuthController {
  @catchErrors()
  async getGithubAuthUrl(req: Request, res: Response) {
    const authUrl = authService.getGithubAuthUrl();
    sendSuccess(res, { authUrl });
  }
}
