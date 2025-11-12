import { z } from "zod";
import { ECourseStatus } from "../types";

const SChapterBase = z.object({
  name: z
    .string({ message: "Chapter name is required" })
    .nonempty("Chapter name is required")
    .min(3, "Name must be at least 3 characters"),
  description: z
    .string({ message: "Description is required" })
    .nonempty("Description is required"),
  status: z.enum(ECourseStatus, {
    message: "Status is required",
  }),
});

export const SChapterCreate = SChapterBase.extend({
  courseId: z.number({ message: "Course is required" }).int().positive(),
  moduleId: z.number({ message: "Module is required" }).int().positive(),
});

export const SChapterUpdate = SChapterBase.extend({});

export const SChapterPositionUpdateParams = z.object({
  moduleId: z.coerce
    .number({ message: "Module ID is required" })
    .int()
    .positive("Module ID must be positive"),
  courseId: z.coerce
    .number({ message: "Course ID is required" })
    .int()
    .positive("Course ID must be positive"),
});
