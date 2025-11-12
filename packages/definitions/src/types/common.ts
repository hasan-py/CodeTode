import { z } from "zod";
import { SUpdatePositionArray, SUpdatePositions } from "../validations";
import { ECourseStatus } from "./course";

export interface IPaginatedResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICommonFilters {
  search?: string;
  page?: number;
  limit?: number;
  status?: ECourseStatus;
}

export interface IProgress {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  totalXpEarned: number;
}

export type AnyZodObject = z.ZodObject<any, any>;
export type TUpdatePositionArray = z.infer<typeof SUpdatePositionArray>;
export type TUpdatePositions = z.infer<typeof SUpdatePositions>;
