import {
  SChapterCreate,
  SChapterPositionUpdateParams,
  SChapterUpdate,
  SIdParams,
  SUpdatePositions,
} from "@packages/definitions";
import { Router } from "express";
import { ChapterController } from "../../controllers/course/chapter";
import { validator } from "../../ middleware/validator";

class ChapterRoutes {
  router: Router;
  chapterController: ChapterController;

  constructor() {
    this.router = Router();
    this.chapterController = new ChapterController();
    this.routes();
  }

  routes() {
    const {
      getChapters,
      getChapter,
      createChapter,
      updateChapter,
      archiveChapter,
      updateChapterPositions,
    } = this.chapterController;

    this.router.get("/", getChapters);
    this.router.get("/:id", validator({ params: SIdParams }), getChapter);
    this.router.post("/", validator({ body: SChapterCreate }), createChapter);
    this.router.put(
      "/:id",
      validator({ body: SChapterUpdate, params: SIdParams }),
      updateChapter
    );

    this.router.post(
      "/:id/archive",
      validator({
        params: SIdParams,
      }),
      archiveChapter
    );

    this.router.put(
      "/positions/:courseId/:moduleId",
      validator({
        body: SUpdatePositions,
        params: SChapterPositionUpdateParams,
      }),
      updateChapterPositions
    );
  }
}

export const ChapterRouter = new ChapterRoutes().router;
