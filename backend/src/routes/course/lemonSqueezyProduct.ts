import { Router } from "express";
import { lemonSqueezyProductController } from "../../controllers/course/lemonSqueezyProduct";

class LemonSqueezyRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    const { getAllProducts } = lemonSqueezyProductController;
    this.router.get("/", getAllProducts);
  }
}

export const LemonSqueezyRouter = new LemonSqueezyRoutes().router;
