import {
  SIdParams,
  SModuleCreate,
  SModuleUpdate,
  SPaginationQuery,
  SUpdatePositions,
} from "@packages/definitions";
import { Router } from "express";
import { validator } from "../../ middleware/validator";
import { ModuleController } from "../../controllers/course/module";

class ModuleRoutes {
  router: Router;
  moduleController: ModuleController;

  constructor() {
    this.router = Router();
    this.moduleController = new ModuleController();
    this.routes();
  }

  routes() {
    const {
      getModules,
      getModule,
      createModule,
      updateModule,
      archiveModule,
      updateModulePositions,
    } = this.moduleController;

    this.router.get("/", validator({ query: SPaginationQuery }), getModules);
    this.router.get("/:id", validator({ params: SIdParams }), getModule);
    this.router.post("/", validator({ body: SModuleCreate }), createModule);
    this.router.put(
      "/:id",
      validator({ params: SIdParams, body: SModuleUpdate }),
      updateModule
    );

    this.router.post(
      "/:id/archive",
      validator({ params: SIdParams }),
      archiveModule
    );

    this.router.put(
      "/positions/:id", // id is the courseId here
      validator({ body: SUpdatePositions, params: SIdParams }),
      updateModulePositions
    );
  }
}

export const ModuleRouter = new ModuleRoutes().router;
