import { z } from "zod";
import { SUpdatePositionArray, SUpdatePositions } from "../validations";

export interface PaginatedResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AnyZodObject = z.ZodObject<any, any>;
export type TUpdatePositionArray = z.infer<typeof SUpdatePositionArray>;
export type TUpdatePositions = z.infer<typeof SUpdatePositions>;
