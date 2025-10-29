import {
  getGithubCallbackApi,
  getGithubUrlApi,
  postLogoutApi,
} from "@/api/endpoints/auth";
import { Logger } from "@packages/logger";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetGithubUrlMutation() {
  return useMutation({
    mutationFn: async () => {
      const response = await getGithubUrlApi();
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      } else {
        Logger.error("Failed to get GitHub auth URL", data);
      }
    },
    onError: (error) => {
      Logger.error("Error getting GitHub auth URL:", error);
    },
  });
}

export function useGetGithubCallbackQuery(code: string | null) {
  return useQuery({
    queryKey: ["githubAuth", code],
    queryFn: async () => {
      if (!code) throw new Error("No authorization code found");
      const response = await getGithubCallbackApi(code);
      return response.data;
    },
    enabled: !!code,
    refetchOnWindowFocus: false,
  });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      const response = await postLogoutApi();
      return response.data;
    },
  });
}
