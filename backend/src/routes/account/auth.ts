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
    const { getGithubAuthUrl } = this.authController;

    this.router.get("/github/url", getGithubAuthUrl);
  }
}

export const AuthRouter = new AuthRoutes().router;
