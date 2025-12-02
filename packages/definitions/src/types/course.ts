import z from "zod";
import { SCourseCreate } from "../validations";
import type { IPaginatedResult } from "./common";
import type { IModule } from "./module";

export enum ECourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum EEnrollmentStatus {
  ACTIVE = "active",
  EXPIRED = "expired",
  REFUNDED = "refunded",
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
  modules?: IModule[];
}

export interface IPaginatedCourseResult extends IPaginatedResult {
  courses: ICourse[];
}

export type TCourseCreate = z.infer<typeof SCourseCreate>;
export type TCourseUpdate = Partial<TCourseCreate> & {
  id: number;
};
