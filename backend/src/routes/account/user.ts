import { SUpdateUserProfileWithId } from "@packages/definitions";
import { Router } from "express";
import { validator } from "../../ middleware/validator";
import { UserController } from "../../controllers/account/user";
import { CourseEnrollmentController } from "../../controllers/course/courseEnrollment";

class UserRoutes {
  router: Router;
  adminRouter: Router;

  private userController: UserController = new UserController();
  private userEnrolledCourse: CourseEnrollmentController =
    new CourseEnrollmentController();

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
    const { getStatisticsData } = this.userEnrolledCourse;

    this.adminRouter.get("/learners", getAllActiveLearner);
    this.adminRouter.get("/statistics", getStatisticsData);
  }
}

export const UserRouter = new UserRoutes().router;
export const AdminUserRouter = new UserRoutes().adminRouter;
