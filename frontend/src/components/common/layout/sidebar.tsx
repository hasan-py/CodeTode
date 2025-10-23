import Button from "@/components/common/button";
import {
  generateSidebarRoutes,
  mapRoutesToMenuItems,
} from "@/utilities/ui/sidebarMenuUtils";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import React, { useState } from "react";

export interface ISidebarMenu {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to?: string;
  badge?: number | string;
}

interface ISidebarUserInfo {
  name: string;
  image?: string;
}

interface SidebarProps {
  userInfo: ISidebarUserInfo;
  menus: ISidebarMenu[];
  logoutHandler?: () => void;
  isAdmin?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userInfo,
  menus,
  logoutHandler,
  isAdmin = true,
}) => {
  const routerState = useRouterState();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const routeObj = generateSidebarRoutes(
    isAdmin,
    router.flatRoutes
      ?.map((item) => ({ url: item?.to, id: item?.id }))
      ?.filter((item) =>
        isAdmin ? item.url.includes("admin") : item?.url.includes("learner")
      )
  );

  const _menus = mapRoutesToMenuItems(routeObj, menus);

  const isActive = (label: string) => {
    return routerState.location.pathname?.includes(label?.toLocaleLowerCase());
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/10 z-20 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Hamburger menu button */}
      <Button
        variant="outline"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        outlineColor="emerald"
        size="sm"
        className="fixed top-4 left-4 z-30 lg:hidden rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        ) : (
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        )}
      </Button>

      <div
        className={`w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div
              onClick={() => (window.location.href = "/")}
              className="cursor-pointer flex items-center space-x-2"
            >
              <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">CT</span>
              </div>
              <span className="text-gray-900 dark:text-white font-semibold">
                CodeTode
              </span>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4">
            {_menus?.map((item, index) => {
              return (
                <div
                  key={index + 1}
                  onClick={() => {
                    router.navigate({ to: item?.to });
                    setIsMobileOpen(false);
                  }}
                  className={`${
                    isActive(item?.label)
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white"
                      : ""
                  } flex cursor-pointer items-center px-4 py-3 rounded-lg mb-2 transition-colors duration-200 text-gray-600 dark:text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white`}
                >
                  <div className="relative">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.badge && (
                      <span className="absolute -top-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.label}
                </div>
              );
            })}
          </nav>

          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-gray-900 dark:text-white">
                  <img
                    className="h-8 w-8 rounded-full"
                    src={userInfo?.image || "https://placehold.co/400"}
                    alt="profile"
                    onError={(
                      e: React.SyntheticEvent<HTMLImageElement, Event>
                    ) => {
                      e.currentTarget.src = "https://placehold.co/50";
                    }}
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {userInfo.name}
                </span>
              </div>
              <div className="flex items-center">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={logoutHandler}
                  icon={<LogOut className="h-4 w-4" />}
                ></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
