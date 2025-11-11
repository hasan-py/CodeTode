import { ECourseStatus, TUpdatePositions } from "@packages/definitions";
import { Request, Response } from "express";
import { catchErrors } from "../../decorators/catchErrors";
import { courseService } from "../../services/course/course";
import { sendError, sendSuccess } from "../../utils/response";

export class CourseController {
  @catchErrors()
  async getPublicCourses(req: Request, res: Response) {
    const { page, limit } = req.validated.query;
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: ECourseStatus.PUBLISHED,
    };

    const result = await courseService.listCourses(options);
    sendSuccess(res, result);
  }

  @catchErrors()
  async getPublicCourse(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const course = await courseService.findCourseWithNestedRelations(id, [
      "modules",
    ]);

    if (!course) return sendError(res, "Course not found", 404);

    sendSuccess(res, course);
  }

  @catchErrors()
  async getCourses(req: Request, res: Response) {
    const { page, limit, status } = req.validated.query;
    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      status: status as ECourseStatus,
    };

    const result = await courseService.listCourses(options);
    sendSuccess(res, result);
  }

  @catchErrors()
  async getCourse(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const course = await courseService.getById(id);

    if (!course) return sendError(res, "Course not found", 404);

    sendSuccess(res, course);
  }

  @catchErrors()
  async createCourse(req: Request, res: Response) {
    const result = await courseService.createCourse(req.body);
    sendSuccess(res, result, 201);
  }

  @catchErrors()
  async updateCourse(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await courseService.updateCourse(id, req.body);

    if (!result) return sendError(res, "Course not found", 404);

    sendSuccess(res, result);
  }

  @catchErrors()
  async archiveCourse(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await courseService.archiveCourse(id);

    if (!result) return sendError(res, "Course not found", 404);

    sendSuccess(res, result);
  }

  @catchErrors()
  async updateCoursePositions(req: Request, res: Response) {
    const { positions }: TUpdatePositions = req.body;
    await courseService.updateCoursePositions(positions);
    sendSuccess(res, { message: "Course positions updated successfully" });
  }
}
