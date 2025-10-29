import z from "zod";
import { SCourseCreate } from "../validations";
import { PaginatedResult } from "./common";

export enum ECourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export interface ICourse {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  status: ECourseStatus;
  price: string;
  position: number;
  createdAt: string;
  validityYear?: number;
  updatedAt: string;
  lemonSqueezyProductId?: string | null;
  moduleCount: number;
  chapterCount: number;
  lessonCount: number;
  quizCount: number;
  enrollLink?: string;
}

export interface ICourseListQueryOptions {
  page?: number;
  limit?: number;
  status?: ECourseStatus;
}

export interface IPaginatedCourseResult extends PaginatedResult {
  courses: ICourse[];
}

export type TCourseCreate = z.infer<typeof SCourseCreate>;
export type TCourseUpdate = Partial<TCourseCreate> & {
  id: number;
};
