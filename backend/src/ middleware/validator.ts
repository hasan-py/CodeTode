import { AnyZodObject } from "@packages/definitions";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { sendValidationError } from "../utils/response";
import { Logger } from "@packages/logger";

type RequestValidationSchemas = {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
};

type ValidationErrorDetail = {
  field: string;
  message: string;
  code: string;
};

type ErrorResponseItem = {
  message: string;
  type: "Query" | "Params" | "Body";
  errors: ValidationErrorDetail[];
};

/* 
This error occurs because in recent versions of Express (v4.18+), 
req.query is now a getter-only property and cannot be directly reassigned.
*/
declare module "express" {
  interface Request {
    validated?: {
      query?: any;
      params?: any;
    };
  }
}

export const validator =
  (schemas: RequestValidationSchemas): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const errors: Array<ErrorResponseItem> = [];

    if (schemas.params) {
      const parsed = schemas.params.safeParse(req.params);
      if (parsed.success) {
        if (!req.validated) req.validated = {};
        req.validated.params = parsed.data;
      } else {
        errors.push({
          type: "Params",
          message: "Validation failed for params",
          errors: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        });
      }
    }

    if (schemas.query) {
      const parsed = schemas.query.safeParse(req.query);
      if (parsed && parsed.success) {
        if (!req.validated) req.validated = {};
        req.validated.query = parsed.data;
      } else if (parsed && !parsed.success) {
        errors.push({
          type: "Query",
          message: "Validation failed for query",
          errors: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        });
      }
    }

    if (schemas.body) {
      const parsed = schemas.body.safeParse(req.body);
      if (parsed.success) {
        req.body = parsed.data;
      } else {
        errors.push({
          type: "Body",
          message: "Validation failed for body",
          errors: parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
          })),
        });
      }
      Logger.debug("body", req.body);
    }

    if (errors.length > 0) {
      sendValidationError(res, errors);
      return;
    }

    return next();
  };
