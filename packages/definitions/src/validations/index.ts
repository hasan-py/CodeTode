import { z } from "zod";

export type AnyZodObject = z.ZodObject<any, any>;

export const SIdParams = z.object({
  id: z.coerce
    .number({
      message: "id must be a number",
    })
    .int("id must be an integer")
    .positive("id must be a positive integer"),
});

export * from "./user";
export * from "./course";
