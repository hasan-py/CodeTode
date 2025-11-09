import AdminLayout from "@/components/admin/adminLayout";
import ModuleForm from "@/components/admin/course/moduleForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/module/new-module")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout isFormLayout>
      <ModuleForm />
    </AdminLayout>
  );
}
