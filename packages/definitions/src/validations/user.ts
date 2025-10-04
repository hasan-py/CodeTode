import { z } from "zod";

export const SUpdateUserProfile = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  imageUrl: z
    .url({ message: "Please enter a valid URL" })
    .min(1, "Image URL is required"),
});
