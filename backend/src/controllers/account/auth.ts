import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { authService } from "../../services/account/auth";
import { sendError, sendSuccess } from "../../utils/response";
import { Logger } from "@packages/logger";

const COOKIE_CONFIG = {
  refreshToken: {
    name: "refreshToken",
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : ("lax" as "none" | "lax"),
      path: "/",
      domain: process.env.NODE_ENV === "production" ? undefined : "localhost",
      maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || "120") * 1000, // In milliseconds
    },
  },
};

export class AuthController {
  @catchErrors()
  async getGithubAuthUrl(req: Request, res: Response) {
    const authUrl = authService.getGithubAuthUrl();
    sendSuccess(res, { authUrl });
  }

  @catchErrors("Authentication failed")
  async handleGithubCallback(req: Request, res: Response) {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return sendError(res, "Authorization code is required", 400);
    }

    const deviceInfo = req.get("User-Agent");
    const ipAddress = req.ip;

    try {
      const authResult = await authService.handleGithubCallback(
        code,
        deviceInfo,
        ipAddress
      );

      res.cookie(
        COOKIE_CONFIG.refreshToken.name,
        authResult.refreshToken,
        COOKIE_CONFIG.refreshToken.options
      );

      return sendSuccess(res, {
        user: {
          id: authResult.user.id,
          username: authResult.user.username,
          name: authResult.user.name,
          email: authResult.user.email,
          role: authResult.user.role,
          imageUrl: authResult.user.imageUrl,
        },
        accessToken: authResult.accessToken,
      });
    } catch (error) {
      Logger.error("GitHub authentication error:", error);
      return sendError(res, "Authentication failed", 401);
    }
  }

  @catchErrors("Failed to log out")
  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies[COOKIE_CONFIG.refreshToken.name];
    if (!refreshToken) return sendError(res, "Refresh token is required", 400);

    const result = await authService.logout(refreshToken);

    res.clearCookie(COOKIE_CONFIG.refreshToken.name, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    if (result) {
      sendSuccess(res, { success: true });
    } else {
      sendError(res, "Invalid refresh token", 400);
    }
  }

  @catchErrors("Access token generation failed")
  async refreshAccessToken(req: Request, res: Response) {
    const refreshToken = req.cookies[COOKIE_CONFIG.refreshToken.name];
    if (!refreshToken) return sendError(res, "Refresh token is required", 400);

    const tokens = await authService.refreshAccessToken(refreshToken);

    res.cookie(
      COOKIE_CONFIG.refreshToken.name,
      tokens.refreshToken,
      COOKIE_CONFIG.refreshToken.options
    );

    sendSuccess(res, {
      accessToken: tokens.accessToken,
    });
  }
}
