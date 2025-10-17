import { api } from "..";

export const getGithubUrlApi = async () => {
  const res = await api.get("/auth/github/url");
  return res;
};