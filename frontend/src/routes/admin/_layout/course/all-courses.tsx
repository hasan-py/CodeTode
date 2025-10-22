import AdminLayout from "@/components/admin/adminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/course/all-courses")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout title="All Courses">
      <h1>Hello world!</h1>
    </AdminLayout>
  );
}
