import AdminLayout from "@/components/admin/adminLayout";
import ModuleForm from "@/components/admin/course/moduleForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/admin/_layout/module/$moduleId/edit-module"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { moduleId } = Route.useParams();
  return (
    <AdminLayout
      isTab={false}
      title="Edit Module"
      isBreadcrumbs={false}
      isFormLayout
    >
      <ModuleForm id={Number(moduleId)} />
    </AdminLayout>
  );
}
