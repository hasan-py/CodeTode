import AdminLayout from "@/components/admin/adminLayout";
import ChapterForm from "@/components/admin/course/chapterForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/chapter/new-chapter")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminLayout isFormLayout>
      <ChapterForm />
    </AdminLayout>
  );
}
