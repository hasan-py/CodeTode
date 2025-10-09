import { z } from "zod";

export const SUpdateUserProfile = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  imageUrl: z
    .url({ message: "Please enter a valid URL" })
    .min(1, "Image URL is required")
    .optional(),
});

export const SUpdateUserProfileWithId = SUpdateUserProfile.extend({
  id: z.coerce
    .number({
      message: "id must be a number",
    })
    .int("id must be an integer")
    .positive("id must be a positive integer"),
});
