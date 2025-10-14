import { Router } from "express";
import { AuthController } from "../../controllers/account/auth";

class AuthRoutes {
  router: Router;
  authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.routes();
  }

  routes() {
    const { getGithubAuthUrl, handleGithubCallback } = this.authController;

    this.router.get("/github/url", getGithubAuthUrl);
    this.router.get("/github/callback", handleGithubCallback);
  }
}

export const AuthRouter = new AuthRoutes().router;
