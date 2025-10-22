import { adminTabCreator } from "@/utilities/ui/adminTabCreator";
import {
  useRouter,
  useRouterState,
  type AnyRoute,
} from "@tanstack/react-router";

function pathToTitle(path: string): string {
  const cleanedPath: string = path.startsWith("/admin")
    ? path.substring("/admin".length)
    : path;

  const segments: string[] = cleanedPath
    .split("/")
    .filter((segment) => segment !== "");

  const title: string = segments
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");

  return title;
}

export const useAdminLayout = () => {
  const router = useRouter();
  const routeState = useRouterState();
  const currentPath = routeState.location.pathname?.split("/");

  const routes = router.flatRoutes
    ?.filter((route) => route.to?.includes("admin"))
    ?.map((route: AnyRoute) => ({
      title: pathToTitle(route.path),
      url: route.to,
      id: (route.options as { id: string }).id,
    }));

  const routeTab = adminTabCreator(routes);

  return {
    currentPath: currentPath.slice(-2),
    routeTab: routeTab[`/${currentPath[1]}/${currentPath[2]}`],
  };
};
