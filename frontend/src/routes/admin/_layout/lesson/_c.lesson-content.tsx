import AdminLayout from "@/components/admin/adminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/lesson/_c/lesson-content")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  return (
    <AdminLayout title="Lesson" isFormLayout>
      <h1>Lesson Content</h1>
    </AdminLayout>
  );
}
