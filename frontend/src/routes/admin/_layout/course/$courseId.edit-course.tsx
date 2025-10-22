import AdminLayout from "@/components/admin/adminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/admin/_layout/course/$courseId/edit-course"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { courseId } = Route.useParams();
  return (
    <AdminLayout
      isTab={false}
      title="Edit Course"
      isBreadcrumbs={false}
      isFormLayout
    >
      <div className="p-6">Edit Course ID: {courseId}</div>
    </AdminLayout>
  );
}
