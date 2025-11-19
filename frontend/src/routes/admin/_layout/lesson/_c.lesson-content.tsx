import AdminLayout from "@/components/admin/adminLayout";
import Loading from "@/components/common/loading";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const LazyLessonContentForm = lazy(
  () => import("@/components/admin/lesson/lessonContentForm")
);

export const Route = createFileRoute("/admin/_layout/lesson/_c/lesson-content")(
  {
    component: RouteComponent,
  }
);

function RouteComponent() {
  return (
    <AdminLayout title="Lesson" isFormLayout>
      <Suspense fallback={<Loading />}>
        <LazyLessonContentForm />
      </Suspense>
    </AdminLayout>
  );
}
