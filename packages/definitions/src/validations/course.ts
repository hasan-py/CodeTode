import { z } from "zod";
import { ECourseStatus } from "../types";

export const SCourseCreate = z.object({
  name: z
    .string({ message: "Course name is required" })
    .nonempty("Course name is required")
    .min(3, "Name must be at least 3 characters"),
  description: z
    .string({ message: "Description is required" })
    .nonempty("Description is required"),
  status: z.enum(ECourseStatus, {
    message: "Status is required",
  }),
  validityYear: z.coerce
    .number({ message: "Validity year is required" })
    .int()
    .positive("Validity year must be positive"),
  imageUrl: z.url({ message: "Must be a valid URL" }).nullable().optional(),
  lemonSqueezyProductId: z
    .string({ message: "Course is required" })
    .nonempty("Course is required"),
  enrollLink: z.url({ message: "Must be a valid URL" }),
  price: z.coerce.number().positive("Price must be positive").nullable(),
});
