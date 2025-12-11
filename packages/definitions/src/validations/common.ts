import { z } from "zod";
import { ECourseStatus } from "../types";

export const SIdParams = z.object({
  id: z.coerce
    .number({
      message: "id must be a number",
    })
    .int("id must be an integer")
    .positive("id must be a positive integer"),
});

export const SUpdatePositionArray = z
  .array(
    z.object({
      id: z.number().int().positive("ID must be a positive integer."),
      position: z.number().int().min(0, "Position cannot be negative."),
    })
  )
  .nonempty("The list of items cannot be empty.");

export const SUpdatePositions = z.object({
  positions: SUpdatePositionArray,
});

export const SPaginationQuery = z.object({
  status: z.enum(ECourseStatus).optional(),
  limit: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().optional(),
});

export const SLearnerModulesParams = z.object({
  courseId: z.coerce
    .number({ message: "Course ID is required" })
    .int()
    .positive("Course ID must be positive"),
});

export const SLearnerChaptersParams = SLearnerModulesParams.extend({
  moduleId: z.coerce
    .number({ message: "Module ID is required" })
    .int()
    .positive("Module ID must be positive"),
});

export const SLearnerLessonsParams = SLearnerChaptersParams.extend({
  chapterId: z.coerce
    .number({ message: "Chapter ID is required" })
    .int()
    .positive("Chapter ID must be positive"),
});
