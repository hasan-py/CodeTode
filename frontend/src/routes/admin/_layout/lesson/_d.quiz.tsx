import AdminLayout from "@/components/admin/adminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/lesson/_d/quiz")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout title="Lesson" isFormLayout>
      <h1>All Quiz</h1>
    </AdminLayout>
  );
}
