import AdminLayout from "@/components/admin/adminLayout";
import CourseForm from "@/components/admin/course/courseForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/course/new-course")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout isFormLayout>
      <CourseForm />
    </AdminLayout>
  );
}
