import AdminLayout from "@/components/admin/adminLayout";
import LearnerList from "@/components/admin/learnerList";
import ModuleHeader from "@/components/common/layout/moduleHeader";
import Loading from "@/components/common/loading";
import { useGetAllLearnerQuery } from "@/hooks/query/account/user";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/learners")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: allLearners, isLoading } = useGetAllLearnerQuery();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  return (
    <AdminLayout isTab={false}>
      <ModuleHeader title="Learner Overview" isSearch={false}></ModuleHeader>

      <LearnerList learners={allLearners} />
    </AdminLayout>
  );
}
