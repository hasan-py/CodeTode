import { ProtectedRoute } from "@/components/auth/protectedRoute";
import { Sidebar, type ISidebarMenu } from "@/components/common/layout/sidebar";
import { useAuthController } from "@/hooks/controller/account/useAuthController";
import { useTheme } from "@/hooks/ui/useTheme";
import { EUserRole } from "@packages/definitions";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Book,
  CuboidIcon,
  Folder,
  GraduationCap,
  LayoutDashboard,
  User,
  Users2,
} from "lucide-react";

export const Route = createFileRoute("/admin/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  useTheme();
  const { handleLogout, userInfo } = useAuthController();

  const menus: ISidebarMenu[] = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
    },
    { icon: Book, label: "Course" },
    { icon: CuboidIcon, label: "Module" },
    { icon: Folder, label: "Chapter" },
    { icon: GraduationCap, label: "Lesson" },
    { icon: Users2, label: "Learners" },
    { icon: User, label: "Profile" },
  ];

  return (
    <ProtectedRoute requiredRole={EUserRole.ADMIN}>
      <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 flex">
        <Sidebar
          menus={menus}
          userInfo={userInfo}
          logoutHandler={handleLogout}
        />

        <div className="flex-1 lg:ml-64 pt-16 lg:pt-8 px-4 sm:px-6 lg:px-8">
          <div className="max-full mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
