import AdminLayout from "@/components/admin/adminLayout";
import CourseForm from "@/components/admin/course/courseForm";
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
      <CourseForm id={Number(courseId)} />
    </AdminLayout>
  );
}
