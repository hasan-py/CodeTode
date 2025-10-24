import z from "zod";
import { SCourseCreate } from "../validations";

export enum ECourseStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export type TCourseCreate = z.infer<typeof SCourseCreate>;
