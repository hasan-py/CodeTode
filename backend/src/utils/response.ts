import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: any,
  status: number = 200
): void => {
  res.status(status).json(data);
};

export const sendError = (
  res: Response,
  message: string,
  status: number = 400
): void => {
  res.status(status).json({ message: message });
};

export const sendValidationError = (res: Response, errors: any): void => {
  res.status(422).json({
    message: "Validation failed",
    errors,
  });
};
