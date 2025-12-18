import z from "zod";
import { SCourseCreate } from "../validations";
import type { IPaginatedResult, IProgress } from "./common";
import type { IModule } from "./module";
import type { IUser } from "./user";

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

export interface ICourseEnrollmentSummary {
  courseId: number;
  expiresAt: string;
  invoiceLink: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  course: ICourse;
  progress: IProgress;
  learnerProgress: {
    chapterId: number;
    lessonId: number;
    moduleId: number;
  };
  user: IUser;
}

export type TCourseCreate = z.infer<typeof SCourseCreate>;
export type TCourseUpdate = Partial<TCourseCreate> & {
  id: number;
};
