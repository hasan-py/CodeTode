import z from "zod";
import { SChapterCreate, SChapterUpdate } from "../validations/chapter";
import type { ICommonFilters, IPaginatedResult, IProgress } from "./common";
import { ECourseStatus } from "./course";
import type { IModule } from "./module";

export interface IChapter {
  id: number;
  name: string;
  description: string;
  status: ECourseStatus;
  position: number;
  createdAt: string;
  updatedAt: string;
  courseId: number;
  moduleId: number;
  lessonCount: number;
  quizCount: number;
  progress?: IProgress;
  module?: IModule;
  isCurrent?: boolean;
}

export interface IChapterResponse extends IPaginatedResult {
  chapters: IChapter[];
}

export interface IChapterFilters extends ICommonFilters {
  courseId?: number;
  moduleId?: number;
}

export type TChapterCreate = z.infer<typeof SChapterCreate>;
export type TChapterUpdate = z.infer<typeof SChapterUpdate>;
