import z from "zod";
import {
  SLessonContentLinkCreate,
  SLessonContentLinkUpdate,
  SLessonCreate,
  SLessonUpdate,
  SQuizCreate,
  SQuizOptionCreate,
  SQuizOptionUpdate,
  SQuizUpdate,
} from "../validations";
import type { IChapter } from "./chapter";
import type { ICommonFilters, IPaginatedResult, IProgress } from "./common";
import type { ECourseStatus, ICourse } from "./course";
import type { IModule } from "./module";

export enum ELessonType {
  THEORY = "theory",
  QUIZ = "quiz",
  CODING = "coding",
}

export enum ELessonContentLinkType {
  VIDEO = "video",
  MARKDOWN = "markdown",
}

export interface ILesson {
  id: number;
  name: string;
  description: string | null;
  courseId: number;
  course?: ICourse;
  moduleId: number;
  module?: IModule;
  chapterId: number;
  chapter?: IChapter;
  status: ECourseStatus;
  position: number;
  xpPoints: number;
  type: ELessonType;
  createdAt: string;
  updatedAt: string;
  contentLinks?: ILessonContentLink[];
  quizzes?: ILessonQuiz[];
  isLocked?: boolean;
  isCompleted?: boolean;
}

export interface ILessonFilters extends ICommonFilters {
  type?: ELessonType;
  courseId?: number;
  moduleId?: number;
  chapterId?: number;
}

export interface ILessonResponse extends IPaginatedResult {
  lessons: ILesson[];
}

export interface ILessonContentLink {
  id: number;
  lessonId: number;
  url: string;
  title?: string | null;
  linkType: string;
  position: number;
  content: string;
}

export interface ILessonQuiz {
  courseId: number;
  createdAt: string;
  explanation: string;
  id: number;
  lessonId: number;
  position: number;
  question: string;
  updatedAt: string;
  options: IQuizOption[];
}

export interface IQuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
  quizId: number;
}

export interface ICurrentLesson {
  lesson: ILesson;
  progress: IProgress;
  navigation: {
    nextLesson: {
      id: number;
      name: string;
      position: number;
    };
    previousLesson: {
      id: number;
      name: string;
      position: number;
    };
  };
}

export interface ICompletedLesson {
  completedLessons: {
    lessonId: number;
    courseId: number;
    moduleId: number;
    chapterId: number;
    xpEarned: number;
    completedAt: string;
    lessonName: string;
    lessonDescription: string;
    courseName: string;
    moduleName: string;
    chapterName: string;
  }[];
  totalLessons: number;
  totalCompleted: number;
}

export interface IDashboardStatistics {
  monthlySales: Array<{
    name: string;
    sales: number;
  }>;
  courseEnrollments: Array<{
    name: string;
    students: number;
  }>;
  completionRate: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export type TLessonCreate = z.infer<typeof SLessonCreate>;
export type TLessonUpdate = z.infer<typeof SLessonUpdate>;

export type TLessonContentLinkCreate = z.infer<typeof SLessonContentLinkCreate>;
export type TLessonContentLinkUpdate = z.infer<typeof SLessonContentLinkUpdate>;

export type TQuizCreate = z.infer<typeof SQuizCreate>;
export type TQuizUpdate = z.infer<typeof SQuizUpdate>;
export type TQuizOptionCreate = z.infer<typeof SQuizOptionCreate>;
export type TQuizOptionUpdate = z.infer<typeof SQuizOptionUpdate>;
