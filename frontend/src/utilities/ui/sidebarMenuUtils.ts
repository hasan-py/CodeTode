import type { ISidebarMenu } from "@/components/common/layout/sidebar";

export function generateSidebarRoutes(
  isAdmin: boolean,
  _routes: { id: string; url: string }[]
) {
  const sidebarFor = isAdmin ? "/admin/" : "/learner/";
  const categoryMap = new Map<string, string>();
  const routes = _routes
    .sort((a, b) => {
      const idA = a.id.toLowerCase();
      const idB = b.id.toLowerCase();

      if (idA < idB) return -1;
      if (idA > idB) return 1;

      return 0;
    })
    .filter((item) => item.url.includes("/edit") === false);

  routes.forEach((route) => {
    if (
      route.url.startsWith(sidebarFor) &&
      route.url.length > sidebarFor.length
    ) {
      const segments = route.url.split("/");
      const category = segments[2];
      if (category && !categoryMap.has(category)) {
        categoryMap.set(category, route.url);
      }
    }
  });

  const categorizedRoutesObject: { [key: string]: { route: string } } = {};
  categoryMap.forEach((firstRoute, category) => {
    categorizedRoutesObject[category] = { route: firstRoute };
  });

  return categorizedRoutesObject;
}

interface CategoryRouteMap {
  [category: string]: {
    route: string;
  };
}

export function mapRoutesToMenuItems(
  categoryRouteMap: CategoryRouteMap,
  menuItemsStructure: ISidebarMenu[]
): ISidebarMenu[] {
  const enrichedMenuItems: ISidebarMenu[] = [];

  menuItemsStructure.forEach((menuItem) => {
    const categoryKey = menuItem.label?.toLocaleLowerCase();
    const routeInfo = categoryRouteMap[categoryKey];

    const enrichedItem: ISidebarMenu = { ...menuItem };

    if (routeInfo && routeInfo.route) {
      enrichedItem.to = routeInfo.route;
    }

    enrichedMenuItems.push(enrichedItem);
  });

  return enrichedMenuItems;
}
