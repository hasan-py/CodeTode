import { AppDataSource } from "../config/dataSource";
import { User } from "../entity/account/ user";
import { RefreshToken } from "../entity/account/refreshToken";
import { Chapter } from "../entity/course/chapter";
import { Course } from "../entity/course/course";
import { Lesson } from "../entity/course/lesson";
import { LessonContentLink } from "../entity/course/lessonContentLink";
import { Module } from "../entity/course/module";
import { Quiz } from "../entity/course/quiz";
import { QuizOption } from "../entity/course/quizOption";

export const UserRepository = AppDataSource.getRepository(User);
export const RefreshTokenRepository = AppDataSource.getRepository(RefreshToken);

export const CourseRepository = AppDataSource.getRepository(Course);
export const ModuleRepository = AppDataSource.getRepository(Module);
export const ChapterRepository = AppDataSource.getRepository(Chapter);

export const LessonRepository = AppDataSource.getRepository(Lesson);
export const QuizRepository = AppDataSource.getRepository(Quiz);
export const QuizOptionRepository = AppDataSource.getRepository(QuizOption);
export const LessonContentLinkRepository =
  AppDataSource.getRepository(LessonContentLink);
