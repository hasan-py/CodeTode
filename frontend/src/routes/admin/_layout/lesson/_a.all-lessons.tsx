import AdminLayout from "@/components/admin/adminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/lesson/_a/all-lessons")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout>
      <h1>All Lesson</h1>
    </AdminLayout>
  );
}
