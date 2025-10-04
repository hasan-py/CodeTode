import z from "zod";
import { SUpdateUserProfile } from "../validations/user";

export type TUpdateUserProfile = z.infer<typeof SUpdateUserProfile>;
