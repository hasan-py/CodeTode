import z from "zod";
import { SModuleCreate, SModuleUpdate } from "../validations/module";
import type { ICommonFilters, IProgress } from "./common";
import type { ECourseStatus, ICourse } from "./course";

export interface IModule {
  id: number;
  name: string;
  description: string;
  status: ECourseStatus;
  position: number;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  iconName: string;
  chapterCount: number;
  lessonCount: number;
  quizCount: number;
  course?: ICourse;
  progress?: IProgress;
  isCurrent?: boolean;
}

export interface IModuleFilters extends ICommonFilters {
  courseId?: number;
}

export interface IModuleResponse {
  modules: IModule[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type TModuleCreate = z.infer<typeof SModuleCreate>;
export type TModuleUpdate = z.infer<typeof SModuleUpdate>;
