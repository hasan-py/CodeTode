import { AppDataSource } from "../config/dataSource";
import { User } from "../entity/account/ user";
import { RefreshToken } from "../entity/account/refreshToken";
import { Course } from "../entity/course/course";
import { Module } from "../entity/course/module";

export const UserRepository = AppDataSource.getRepository(User);
export const RefreshTokenRepository = AppDataSource.getRepository(RefreshToken);

export const CourseRepository = AppDataSource.getRepository(Course);
export const ModuleRepository = AppDataSource.getRepository(Module);
