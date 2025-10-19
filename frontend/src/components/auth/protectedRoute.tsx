import { authStore } from "@/stores/authStore";
import { EUserRole } from "@packages/definitions";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

interface ProtectedRouteProps {
  requiredRole?: EUserRole;
  children: React.ReactNode;
}

export function ProtectedRoute({
  requiredRole,
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = authStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      if (user?.role === EUserRole.ADMIN) {
        navigate({ to: "/admin/profile" });
      } else if (user?.role === EUserRole.LEARNER) {
        navigate({ to: "/learner/profile" });
      } else {
        navigate({ to: "/" });
      }
    }
  }, [isAuthenticated, user, requiredRole]);

  return <>{children}</>;
}
