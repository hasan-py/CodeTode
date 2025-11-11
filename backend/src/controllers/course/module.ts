import { ECourseStatus, TUpdatePositions } from "@packages/definitions";
import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { moduleService } from "../../services/course/module";
import { sendError, sendSuccess } from "../../utils/response";

export class ModuleController {
  @catchErrors()
  async getModules(req: Request, res: Response) {
    const { page, limit, status, courseId } = req.query;
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as ECourseStatus,
      courseId: courseId ? parseInt(courseId as string) : undefined,
    };

    const result = await moduleService.listModules(options);
    sendSuccess(res, result);
  }

  @catchErrors()
  async getModule(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const module = await moduleService.getById(id);

    if (!module) {
      return sendError(res, "Module not found", 404);
    }

    sendSuccess(res, module);
  }

  @catchErrors()
  async createModule(req: Request, res: Response) {
    const result = await moduleService.createModule(req.body);
    sendSuccess(res, result, 201);
  }

  @catchErrors()
  async updateModule(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await moduleService.updateModule(id, req.body);

    if (!result) {
      return sendError(res, "Module not found", 404);
    }

    sendSuccess(res, result);
  }

  @catchErrors()
  async archiveModule(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await moduleService.archiveModule(id);

    if (!result) {
      return sendError(res, "Module not found", 404);
    }

    sendSuccess(res, result);
  }

  @catchErrors()
  async updateModulePositions(req: Request, res: Response) {
    const { positions }: TUpdatePositions = req.body;
    await moduleService.updateModulePositions(positions, +req.params.id); // courseId
    sendSuccess(res, { message: "Module positions updated successfully" });
  }
}
