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
    const {
      getGithubAuthUrl,
      handleGithubCallback,
      logout,
      refreshAccessToken,
    } = this.authController;

    this.router.get("/github/url", getGithubAuthUrl);
    this.router.get("/github/callback", handleGithubCallback);
    this.router.post("/logout", logout);
    this.router.post("/refresh-token", refreshAccessToken);
  }
}

export const AuthRouter = new AuthRoutes().router;
