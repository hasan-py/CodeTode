import { SIdParams, SUpdateUserProfileWithId } from "@packages/definitions";
import { Router } from "express";
import { validator } from "../../ middleware/validator";
import { UserController } from "../../controllers/account/user";

class UserRoutes {
  router: Router;
  adminRouter: Router;

  private userController: UserController = new UserController();

  constructor() {
    this.router = Router();
    this.adminRouter = Router();
    this.routes();
    this.adminRoutes();
  }

  routes() {
    const { updateUserProfile, getUserProfile } = this.userController;

    this.router.get("/", getUserProfile);
    this.router.put(
      "/",
      validator({ body: SUpdateUserProfileWithId }),
      updateUserProfile
    );
  }

  adminRoutes() {
    const { getAllActiveLearner } = this.userController;
    this.adminRouter.get("/learners", getAllActiveLearner);
  }
}

export const UserRouter = new UserRoutes().router;
export const AdminUserRouter = new UserRoutes().adminRouter;
