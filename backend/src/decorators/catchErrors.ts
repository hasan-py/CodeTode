import { Logger } from "@packages/logger";
import { Request, Response } from "express";

type AsyncControllerMethod = (req: Request, res: Response) => Promise<void>;

export function catchErrors(errorMessage?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value as AsyncControllerMethod;

    descriptor.value = async function (req: Request, res: Response) {
      try {
        return await originalMethod.bind(this)(req, res);
      } catch (error) {
        Logger.error(`Error in ${propertyKey}: ${error}`);

        if (!res.headersSent) {
          res.status(500).json({
            message: errorMessage || error.message,
          });
        }
      }
    };

    return descriptor;
  };
}
