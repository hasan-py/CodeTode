import { type ITab } from "@/components/common/layout/tabs";

interface TabsDataset {
  [key: string]: {
    tabs: ITab[];
    title: string;
  };
}

interface PathItem {
  title: string;
  url: string;
  id: string;
}

export function adminTabCreator(data: PathItem[]): TabsDataset {
  const tabsDataset: TabsDataset = {};

  for (const item of data) {
    const urlParts = item.url
      .split("/")
      .filter((part) => part !== "" && part !== "admin");

    if (urlParts.length >= 1) {
      const categoryKey = `/admin/${urlParts[0]}`;
      const categoryTitle = urlParts[0]
        ? urlParts[0].charAt(0).toUpperCase() + urlParts[0].slice(1)
        : "Admin";

      if (!tabsDataset[categoryKey]) {
        tabsDataset[categoryKey] = {
          tabs: [],
          title: categoryTitle,
        };
      }

      if (urlParts.length >= 2) {
        const tabLabel = urlParts[1]
          ? urlParts[1].charAt(0).toUpperCase() + urlParts[1].slice(1)
          : "";

        const labelLower = tabLabel.toLowerCase();
        const urlLower = item.url.toLowerCase();
        if (labelLower.includes("edit") || urlLower.includes("/edit")) {
          continue;
        }

        const existingTab = tabsDataset[categoryKey].tabs.find(
          (tab) => tab.to === item.url
        );
        if (!existingTab) {
          tabsDataset[categoryKey].tabs.push({
            to: item.url,
            label: tabLabel?.split("-")?.join(" "),
            id: item?.id,
          });
        }
      }
    }
  }

  // Sort tabs alphabetically by label for each category
  for (const categoryUrl in tabsDataset) {
    if (tabsDataset[categoryUrl]?.tabs) {
      tabsDataset[categoryUrl].tabs.sort((a, b) => {
        const idA = a.id.toLowerCase();
        const idB = b.id.toLowerCase();
        if (idA < idB) return -1;
        if (idA > idB) return 1;
        return 0;
      });
    }
  }

  return tabsDataset;
}
