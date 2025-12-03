import express, { Request, Response } from "express";

// Extend the Express Request interface to include rawBody
export interface CustomRequest extends Request {
  rawBody?: string;
}

export const rawBodyVerifyConfig = () => {
  return express.json({
    verify: (
      req: CustomRequest,
      res: Response,
      buf: Buffer,
      encoding: string
    ) => {
      if (buf && buf.length) {
        req.rawBody = buf.toString("utf8");
      }
    },
  });
};
