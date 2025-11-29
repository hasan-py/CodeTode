import {
  ECourseStatus,
  ELessonType,
  TUpdatePositions,
} from "@packages/definitions";
import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { lessonService } from "../../services/course/lesson";
import { lessonContentLinkService } from "../../services/course/lessonContentLink";
import { markdownService } from "../../services/course/markdown";
import { sendError, sendSuccess } from "../../utils/response";
import { quizService } from "../../services/course/quiz";

export class LessonController {
  @catchErrors()
  async getLessons(req: Request, res: Response) {
    const { page, limit, status, type, courseId, moduleId, chapterId } =
      req.query;
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as ECourseStatus,
      type: type as ELessonType,
      courseId: courseId ? parseInt(courseId as string) : undefined,
      moduleId: moduleId ? parseInt(moduleId as string) : undefined,
      chapterId: chapterId ? parseInt(chapterId as string) : undefined,
    };

    const result = await lessonService.listLessons(options);
    sendSuccess(res, result);
  }

  @catchErrors()
  async getLesson(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const lesson = await lessonService.getById(id);

    if (!lesson) {
      return sendError(res, "Lesson not found", 404);
    }

    sendSuccess(res, lesson);
  }

  @catchErrors()
  async createLesson(req: Request, res: Response) {
    const result = await lessonService.createLesson(req.body);
    sendSuccess(res, result, 201);
  }

  @catchErrors()
  async updateLesson(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await lessonService.updateLesson(id, req.body);

    if (!result) {
      return sendError(res, "Lesson not found", 404);
    }

    sendSuccess(res, result);
  }

  @catchErrors()
  async archiveLesson(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await lessonService.archiveLesson(id);

    if (!result) {
      return sendError(res, "Lesson not found", 404);
    }

    sendSuccess(res, result);
  }

  @catchErrors()
  async updateLessonPositions(req: Request, res: Response) {
    const { positions }: TUpdatePositions = req.body;
    await lessonService.updateLessonPositions(positions, {
      courseId: parseInt(req.params.courseId),
      moduleId: parseInt(req.params.moduleId),
      chapterId: parseInt(req.params.chapterId),
    });
    sendSuccess(res, { message: "Lesson positions updated successfully" });
  }

  @catchErrors()
  async createLessonContentLink(req: Request, res: Response) {
    const result = await lessonContentLinkService.createLessonContentLink(
      req.body
    );

    sendSuccess(res, result, 201);
  }

  @catchErrors()
  async getLessonContentLink(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const lesson = await lessonContentLinkService.getLessonContentLinkById(id);
    if (!lesson) return sendError(res, "Lesson content link not found", 404);

    sendSuccess(res, lesson);
  }

  @catchErrors()
  async updateLessonContentLink(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await lessonContentLinkService.updateLessonContentLink(
      id,
      req.body
    );

    if (!result) return sendError(res, "Lesson content link not found", 404);
    sendSuccess(res, result);
  }

  @catchErrors()
  async getMarkdownLessonList(req: Request, res: Response) {
    const lessons = await markdownService.getMarkdownLessonList();
    sendSuccess(res, lessons);
  }

  @catchErrors()
  async getMarkdownLessonContent(req: Request, res: Response) {
    const filePath = req.query.path as string;
    if (!filePath) return sendError(res, "File path is required", 400);
    const content = await markdownService.getMarkdownLessonContent(filePath);
    sendSuccess(res, { content });
  }

  @catchErrors()
  async getQuiz(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const quiz = await quizService.getById(id);

    if (!quiz) return sendError(res, "Quiz not found", 404);
    sendSuccess(res, quiz);
  }

  @catchErrors()
  async createQuiz(req: Request, res: Response) {
    const { options, ...quizData } = req.body;
    const result = await quizService.createQuiz(quizData, options || []);
    sendSuccess(res, result, 201);
  }

  @catchErrors()
  async updateQuiz(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { options, ...quizData } = req.body;
    const result = await quizService.updateQuizWithOptions(
      id,
      quizData,
      options
    );

    if (!result) return sendError(res, "Quiz not found", 404);
    sendSuccess(res, result);
  }
}
