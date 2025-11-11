import { z } from "zod";
import { ECourseStatus } from "../types";

const SModuleBase = z.object({
  name: z
    .string({ message: "Module name is required" })
    .nonempty("Module name is required")
    .min(3, "Name must be at least 3 characters"),
  description: z
    .string({ message: "Description is required" })
    .nonempty("Description is required"),
  iconName: z
    .string({ message: "Icon name is required" })
    .nonempty("Icon name is required"),
  status: z.enum(ECourseStatus, {
    message: "Status is required",
  }),
});

export const SModuleCreate = SModuleBase.extend({
  courseId: z.number({ message: "Course is required" }).int().positive(),
});

export const SModuleUpdate = SModuleBase.extend({});
