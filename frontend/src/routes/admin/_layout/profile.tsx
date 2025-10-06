import ProfileForm from "@/components/admin/profileForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full xl:w-1/2 mx-auto">
      <div className="bg-white/90 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-semibold">Profile</h1>

        <ProfileForm />
      </div>
    </div>
  );
}
