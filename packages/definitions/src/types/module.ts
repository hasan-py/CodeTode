import z from "zod";
import { SModuleCreate, SModuleUpdate } from "../validations/module";
import { IProgress } from "./common";
import { ECourseStatus, ICourse } from "./course";

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

export type TModuleCreateSchema = z.infer<typeof SModuleCreate>;
export type TModuleUpdateSchema = z.infer<typeof SModuleUpdate>;
