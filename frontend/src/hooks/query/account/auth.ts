import { getGithubUrlApi } from "@/api/endpoints/auth";
import { Logger } from "@packages/logger";
import { useMutation } from "@tanstack/react-query";

export function useGetGithubUrl() {
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
