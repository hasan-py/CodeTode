import { z } from "zod";
import { SUpdatePositionArray } from "../validations";

export interface PaginatedResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AnyZodObject = z.ZodObject<any, any>;
export type TUpdatePositionArray = z.infer<typeof SUpdatePositionArray>;
