import AdminLayout from "@/components/admin/adminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/admin/_layout/lesson/$lessonId/edit-lesson"
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout
      isTab={false}
      title="Edit Lesson"
      isBreadcrumbs={false}
      isFormLayout
    >
      <h1>Edit Lesson</h1>
    </AdminLayout>
  );
}
