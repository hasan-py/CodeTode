import { useGetGithubCallbackQuery } from "@/hooks/query/account/auth";
import { authStore } from "@/stores/authStore";
import { EUserRole } from "@packages/definitions";
import { Logger } from "@packages/logger";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function useGithubCallbackController() {
  const navigate = useNavigate();
  const login = authStore((state) => state.login);

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");

  const { isLoading, isError, data, error } = useGetGithubCallbackQuery(code);

  useEffect(() => {
    if (!code && !isLoading) {
      Logger.error("No authorization code found");
      setTimeout(() => navigate({ to: "/signin" }), 1000);
    }
  }, [code, isLoading]);

  useEffect(() => {
    if (data?.user) {
      login(data.accessToken, data.user);

      setTimeout(() => {
        const redirectPath =
          data.user.role === EUserRole.ADMIN
            ? "/admin/profile"
            : data.user.role === EUserRole.LEARNER
            ? "/learner/courses"
            : "/";
        navigate({ to: redirectPath });
      }, 500);
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      Logger.error("Authentication failed:", error);
      setTimeout(() => navigate({ to: "/signin" }), 500);
    }
  }, [isError, error]);
}
