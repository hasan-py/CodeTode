import type { TUpdateUserProfileWithId } from "@packages/definitions";
import { api } from "..";

export const getUserProfileApi = async () => {
  const res = await api.get("/profile");
  return res;
};

export const putUpdateProfileApi = async (data: TUpdateUserProfileWithId) => {
  const res = await api.put("/profile", data);
  return res;
};

export const getAllActiveLearnerApi = async () => {
  const res = await api.get("/admin/user/learners");
  return res;
};
