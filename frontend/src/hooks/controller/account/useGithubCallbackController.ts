import { useGetGithubCallback } from "@/hooks/query/account/auth";
import { EUserRole } from "@packages/definitions";
import { Logger } from "@packages/logger";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export function useGithubCallbackController() {
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");

  const { isLoading, isError, data, error } = useGetGithubCallback(code);

  useEffect(() => {
    if (!code && !isLoading) {
      Logger.error("No authorization code found");
      setTimeout(() => navigate({ to: "/signin" }), 1000);
    }
  }, [code, isLoading, navigate]);

  useEffect(() => {
    if (data?.user) {
      const redirectPath =
        data.user.role === EUserRole.ADMIN
          ? "/admin/profile"
          : data.user.role === EUserRole.LEARNER
          ? "/learner/profile"
          : "/";
      navigate({ to: redirectPath });
    }
  }, [data, navigate]);

  useEffect(() => {
    if (isError) {
      Logger.error("Authentication failed:", error);
      setTimeout(() => navigate({ to: "/signin" }), 500);
    }
  }, [isError, error, navigate]);
}
