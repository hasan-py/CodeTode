import { EUserRole } from "@packages/definitions";
import { Logger } from "@packages/logger";
import { NextFunction, Request, Response } from "express";
import { authService } from "../services/account/auth";
import { sendError } from "../utils/response";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: EUserRole;
      };
    }
  }
}

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      Logger.debug("Auth failed: No auth header provided");
      return sendError(res, "Unauthorized request", 401);
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      Logger.debug("Auth failed: Invalid token format", parts);
      return sendError(res, "Invalid or expired token", 401);
    }

    const token = parts[1];
    Logger.debug("Verifying token:", token.substring(0, 10) + "...");

    const decoded = authService.verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    Logger.error("JWT verification error:", error.message);
    return sendError(res, "Invalid or expired token", 401);
  }
};

export const authenticateLearner = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    authenticateJwt(req, res, () => {
      if (
        req.user?.role === EUserRole.LEARNER ||
        req.user?.role === EUserRole.ADMIN
      ) {
        next();
      } else {
        sendError(res, "Unauthorized request", 403);
      }
    });
  } catch (error) {
    return sendError(res, "Authentication failed", 401);
  }
};

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    authenticateJwt(req, res, () => {
      Logger.debug("req", req.user.role);
      if (req.user?.role === EUserRole.ADMIN) {
        next();
      } else {
        sendError(res, "Unauthorized request", 403);
      }
    });
  } catch (error) {
    return sendError(res, "Authentication failed", 401);
  }
};
