import { api } from "..";

export const getGithubUrlApi = async () => {
  const res = await api.get("/auth/github/url");
  return res;
};

export const getGithubCallbackApi = async (code: string) => {
  const res = await api.get("/auth/github/callback", {
    params: { code },
  });
  return res;
};

export const postLogoutApi = async () => {
  const res = await api.post("/auth/logout");
  return res;
};
