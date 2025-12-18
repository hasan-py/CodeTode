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
  totalXp?: number;
  currentStreak?: number;
}

export interface IActivityGraph {
  date: string;
  activityLevel: number;
  xpEarned: number;
  lessons: number;
}

// Represents a single record from the raw input dataset
export type TLearnerStats = {
  userid: number;
  githubid: string;
  username: string;
  name: string;
  email: string;
  joinedat: string;
  imageurl: string;
  role: "learner" | "admin" | "instructor";
  status: "active" | "inactive";
  lastlogin: string;
  createdat: string;
  updatedat: string;
  totalxp: number;
  currentstreak: number;
  courseid: number;
  coursename: string;
  courseprice: string;
  totallessons: string;
  completedlessons: string;
};

// Represents the final, formatted user object for display
export type TFormattedLearnerInfo = {
  userid: number;
  email: string;
  name: string;
  imageUrl: string;
  memberSince: string;
  status: string;
  enrolledCourses: number;
  totalXp: number;
  currentStreak: string;
  currentProgressList: { name: string; progress: number }[];
  totalSpent: string;
};

// An intermediate structure used during the aggregation process
export type TAggregatedLearnerStats = {
  userid: number;
  email: string;
  name: string;
  imageUrl?: string;
  joinedat: string;
  status: "active" | "inactive";
  totalXp: number;
  currentStreak: number;
  courses: Array<{
    name: string;
    progress: number;
  }>;
  totalSpent: number;
};

export interface ILeaderboard {
  currentStreak: number;
  imageUrl: string | null;
  longestStreak: number;
  name: string;
  totalXp: number;
  userId: number;
}

export type TUpdateUserProfile = z.infer<typeof SUpdateUserProfile>;
export type TUpdateUserProfileWithId = z.infer<typeof SUpdateUserProfileWithId>;
