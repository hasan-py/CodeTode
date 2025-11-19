import AdminLayout from "@/components/admin/adminLayout";
import LessonForm from "@/components/admin/lesson/lessonForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/lesson/_b/new-lesson")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout title="Lesson" isFormLayout>
      <LessonForm />
    </AdminLayout>
  );
}
