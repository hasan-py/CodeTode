import { Sidebar, type ISidebarMenu } from "@/components/common/layout/sidebar";
import { useTheme } from "@/hooks/ui/useTheme";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BookA, CreditCard, User } from "lucide-react";

export const Route = createFileRoute("/learner/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  useTheme();

  const logoutHandler = () => {};

  const menus: ISidebarMenu[] = [
    { icon: BookA, label: "Courses" },
    { icon: CreditCard, label: "Billing" },
    { icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 flex">
      <Sidebar
        menus={menus}
        userInfo={{
          name: "Learner Hasan",
        }}
        logoutHandler={logoutHandler}
      />

      <div className="flex-1 lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8">
        <div className="max-full mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
