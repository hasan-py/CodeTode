import AdminLayout from "@/components/admin/adminLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/course/new-course")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout isFormLayout>
      <div className="p-6">Course Creation Form</div>
    </AdminLayout>
  );
}
