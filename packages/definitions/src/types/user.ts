import z from "zod";
import {
  SUpdateUserProfile,
  SUpdateUserProfileWithId,
} from "../validations/user";

export enum EUserRole {
  LEARNER = "learner",
  ADMIN = "admin",
}

export enum EUserStatus {
  ACTIVE = "active",
  DEACTIVATE = "deactivate",
}

export interface IUser {
  id: number;
  username?: string;
  name?: string;
  email?: string;
  imageUrl?: string;
  role: EUserRole;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  courseEnrollments?: number[];
}

export type TUpdateUserProfile = z.infer<typeof SUpdateUserProfile>;
export type TUpdateUserProfileWithId = z.infer<typeof SUpdateUserProfileWithId>;
