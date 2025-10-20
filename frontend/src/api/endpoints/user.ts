import { api } from "..";

export const getUserProfileApi = async () => {
  const res = await api.get("/profile");
  return res;
};
