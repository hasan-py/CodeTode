import {
  SIdParams,
  SUpdateUserProfileWithId
} from "@packages/definitions";
import { Router } from "express";
import { validator } from "../../ middleware/validator";
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

    this.router.get(
      "/",
      validator({
        query: SIdParams,
      }),
      getUserProfile
    );
    this.router.put(
      "/update-profile",
      validator({ body: SUpdateUserProfileWithId }),
      updateUserProfile
    );
  }
}

export const UserRouter = new UserRoutes().router;
