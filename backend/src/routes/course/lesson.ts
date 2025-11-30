import {
  SIdParams,
  SLessonContentLinkCreate,
  SLessonContentLinkUpdate,
  SLessonCreate,
  SLessonUpdate,
  SLessonUpdatePositionsParams,
  SMarkdownLessonContentParams,
  SQuizCreate,
  SQuizUpdate,
  SUpdatePositions,
} from "@packages/definitions";
import { Router } from "express";
import { LessonController } from "../../controllers/course/lesson";
import { validator } from "../../ middleware/validator";

class LessonRoutes {
  router: Router;
  lessonController: LessonController;

  constructor() {
    this.router = Router();
    this.lessonController = new LessonController();
    this.routes();
  }

  routes() {
    const {
      getLessons,
      getLesson,
      createLesson,
      updateLesson,
      archiveLesson,
      updateLessonPositions,
      getMarkdownLessonList,
      getMarkdownLessonContent,
      createLessonContentLink,
      updateLessonContentLink,
      getLessonContentLink,
      getQuiz,
      createQuiz,
      updateQuiz,
    } = this.lessonController;

    // Lesson Content Link
    this.router.post(
      "/lesson-content-link",
      validator({ body: SLessonContentLinkCreate }),
      createLessonContentLink
    );
    this.router.get(
      "/lesson-content-link/:id",
      validator({ params: SIdParams }),
      getLessonContentLink
    );
    this.router.put(
      "/lesson-content-link/:id",
      validator({ body: SLessonContentLinkUpdate, params: SIdParams }),
      updateLessonContentLink
    );

    this.router.get("/markdown-list", getMarkdownLessonList);
    this.router.get(
      "/markdown-content",
      validator({ query: SMarkdownLessonContentParams }),
      getMarkdownLessonContent
    );

    // Quiz
    this.router.get("/quiz/:id", validator({ params: SIdParams }), getQuiz);
    this.router.post("/quiz", validator({ body: SQuizCreate }), createQuiz);
    this.router.put(
      "/quiz/:id",
      validator({ params: SIdParams, body: SQuizUpdate }),
      updateQuiz
    );

    // Lesson
    this.router.get("/", getLessons);
    this.router.post("/", validator({ body: SLessonCreate }), createLesson);

    this.router.get("/:id", validator({ params: SIdParams }), getLesson);
    this.router.put(
      "/:id",
      validator({ body: SLessonUpdate, params: SIdParams }),
      updateLesson
    );

    this.router.post(
      "/:id/archive",
      validator({ params: SIdParams }),
      archiveLesson
    );

    this.router.put(
      "/positions/:courseId/:moduleId/:chapterId",
      validator({
        params: SLessonUpdatePositionsParams,
        body: SUpdatePositions,
      }),
      updateLessonPositions
    );
  }
}

export const LessonRouter = new LessonRoutes().router;
