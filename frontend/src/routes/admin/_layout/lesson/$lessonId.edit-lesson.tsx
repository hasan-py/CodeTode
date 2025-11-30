import AdminLayout from "@/components/admin/adminLayout";
import LessonForm from "@/components/admin/lesson/lessonForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/admin/_layout/lesson/$lessonId/edit-lesson"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { lessonId } = Route.useParams();
  return (
    <AdminLayout
      isTab={false}
      title="Edit Lesson"
      isBreadcrumbs={false}
      isFormLayout
    >
      <LessonForm id={+lessonId} />
    </AdminLayout>
  );
}
