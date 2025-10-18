import Footer from "@/components/website/footer";
import Navbar from "@/components/website/navbar";
import { useAuthController } from "@/hooks/controller/account/useAuthController";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/(website)/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated, user, handleLogout } = useAuthController();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <Navbar auth={{ isAuthenticated, handleLogout, user }} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
