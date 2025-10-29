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
