import { ECourseStatus, TUpdatePositions } from "@packages/definitions";
import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { chapterService } from "../../services/course/chapter";
import { sendError, sendSuccess } from "../../utils/response";

export class ChapterController {
  @catchErrors()
  async getChapters(req: Request, res: Response) {
    const { page, limit, status, moduleId, courseId } = req.query;
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as ECourseStatus,
      moduleId: moduleId ? parseInt(moduleId as string) : undefined,
      courseId: courseId ? parseInt(courseId as string) : undefined,
    };

    const result = await chapterService.listChapters(options);
    sendSuccess(res, result);
  }

  @catchErrors()
  async getChapter(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const chapter = await chapterService.getById(id);

    if (!chapter) {
      return sendError(res, "Chapter not found", 404);
    }

    sendSuccess(res, chapter);
  }

  @catchErrors()
  async createChapter(req: Request, res: Response) {
    const result = await chapterService.createChapter(req.body);
    sendSuccess(res, result, 201);
  }

  @catchErrors()
  async updateChapter(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await chapterService.updateChapter(id, req.body);

    if (!result) {
      return sendError(res, "Chapter not found", 404);
    }

    sendSuccess(res, result);
  }

  @catchErrors()
  async archiveChapter(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await chapterService.archiveChapter(id);

    if (!result) {
      return sendError(res, "Chapter not found", 404);
    }

    sendSuccess(res, result);
  }

  @catchErrors()
  async updateChapterPositions(req: Request, res: Response) {
    const { positions }: TUpdatePositions = req.body;
    await chapterService.updateChapterPositions(
      positions,
      +req.params.courseId,
      +req.params.moduleId
    );
    sendSuccess(res, { message: "Chapter positions updated successfully" });
  }
}
