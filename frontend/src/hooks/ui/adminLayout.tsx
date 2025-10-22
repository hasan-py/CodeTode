import { useRouterState } from "@tanstack/react-router";

export const useAdminLayout = () => {
  const routeState = useRouterState();
  const currentPath = routeState.location.pathname?.split("/");

  return {
    currentPath: currentPath.slice(-2),
  };
};
