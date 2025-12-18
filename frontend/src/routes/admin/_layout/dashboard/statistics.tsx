import AdminLayout from "@/components/admin/adminLayout";
import CompletionRateChart from "@/components/admin/dashboard/completionRateChart";
import CourseEnrollmentChart from "@/components/admin/dashboard/courseEnrollmentChart";
import MonthlySalesChart from "@/components/admin/dashboard/monthlySalesChart";
import Loading from "@/components/common/loading";
import NoDataFound from "@/components/common/noDataFound";
import { useGetStatisticsDataQuery } from "@/hooks/query/course/learner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/_layout/dashboard/statistics")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useGetStatisticsDataQuery();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (!data && isLoading) {
    return <NoDataFound />;
  }

  return (
    <AdminLayout isDashboard>
      <div className="space-y-4">
        <MonthlySalesChart data={data?.monthlySales || []} />
        <CourseEnrollmentChart data={data?.courseEnrollments || []} />
        <CompletionRateChart data={data?.completionRate || []} />
      </div>
    </AdminLayout>
  );
}
