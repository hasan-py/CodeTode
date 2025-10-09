import { Router } from "express";
import { UserController } from "../../controllers/account/user";

class UserRoutes {
  router: Router;
  private userController: UserController = new UserController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    const { updateUserProfile, getUserProfile } = this.userController;

    this.router.get("/", getUserProfile);
    this.router.put("/update-profile", updateUserProfile);
  }
}

export const UserRouter = new UserRoutes().router;
