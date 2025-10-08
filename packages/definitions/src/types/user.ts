import z from "zod";
import { SUpdateUserProfile } from "../validations/user";

export enum EUserRole {
  LEARNER = "learner",
  ADMIN = "admin",
}

export enum EUserStatus {
  ACTIVE = "active",
  DEACTIVATE = "deactivate",
}

export type TUpdateUserProfile = z.infer<typeof SUpdateUserProfile>;
