import { useLogoutMutation } from "@/hooks/query/account/auth";
import { authStore } from "@/stores/authStore";
import { Logger } from "@packages/logger";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

export function useAuthController() {
  const navigate = useNavigate();
  const logoutMutation = useLogoutMutation();
  const {
    user,
    accessToken,
    isAuthenticated,
    login,
    logout,
    updateUser,
    setTokens,
  } = authStore();

  const handleLogout = async () => {
    if (logoutMutation?.isPending) return;

    try {
      await toast.promise(logoutMutation.mutateAsync(), {
        loading: "Logging out...",
      });
    } catch (error) {
      Logger.error("Error during logout:", error);
    } finally {
      logout();
      navigate({ to: "/signin" });
    }
  };

  const userInfo = {
    name: user?.name || "Admin User",
    image: user?.imageUrl,
  };

  return {
    handleLogout,
    user,
    accessToken,
    isAuthenticated,
    login,
    logout,
    updateUser,
    setTokens,
    userInfo,
  };
}
