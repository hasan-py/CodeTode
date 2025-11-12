import AdminLayout from "@/components/admin/adminLayout";
import ChapterForm from "@/components/admin/course/chapterForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/admin/_layout/chapter/$chapterId/edit-chapter"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { chapterId } = Route.useParams();
  return (
    <AdminLayout
      isTab={false}
      title="Edit Chapter"
      isBreadcrumbs={false}
      isFormLayout
    >
      <ChapterForm id={Number(chapterId)} />
    </AdminLayout>
  );
}
