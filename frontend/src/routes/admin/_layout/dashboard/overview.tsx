import AdminLayout from "@/components/admin/adminLayout";
import SummaryCards from "@/components/admin/dashboard/summaryCards";
import Badge from "@/components/common/badge";
import Button from "@/components/common/button";
import ModuleHeader from "@/components/common/layout/moduleHeader";
import NoDataFound from "@/components/common/noDataFound";
import Table, { type ITableHeader } from "@/components/common/table";
import { useGetLearnerBillingSummaryQuery } from "@/hooks/query/course/learner";
import { getDashboardOverviewSummary } from "@/utilities/helper/adminStats";
import type { ICourseEnrollmentSummary } from "@packages/definitions";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/admin/_layout/dashboard/overview")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: billingSummary } = useGetLearnerBillingSummaryQuery(true);

  const summary = useMemo(
    () => getDashboardOverviewSummary(billingSummary || []),
    [billingSummary]
  );

  const TransactionHeaders: ITableHeader<ICourseEnrollmentSummary>[] = [
    {
      label: "Course",
      key: "course",
      render: (rowData) => {
        return (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 mr-3">
              {rowData?.course.imageUrl ? (
                <img src={rowData?.course.imageUrl} alt="course" />
              ) : (
                rowData?.course.name.charAt(0)
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-white w-48 truncate">
                {rowData?.course.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 w-48 truncate">
                {rowData?.course.description}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      label: "User",
      key: "user",
      cellClass: "text-sm text-gray-300",
      render: (rowData) => `${rowData?.user?.name} - ${rowData?.user?.email}`,
    },
    {
      label: "Price",
      key: "totalPrice",
      cellClass: "text-sm text-gray-300",
      render: (rowData) => `$${rowData?.totalPrice}`,
    },
    {
      label: "Enrolled Date",
      key: "createdAt",
      cellClass: "text-sm text-gray-400",
      render: (rowData) => new Date(rowData?.createdAt).toLocaleDateString(),
    },
    {
      label: "Expire Date",
      key: "expiresAt",
      cellClass: "text-sm text-gray-400",
      render: (rowData) => new Date(rowData?.expiresAt).toLocaleDateString(),
    },
    {
      label: "Status",
      key: "status",
      render: (_, statusValue) => {
        const status = (statusValue as string)?.toLowerCase();

        return (
          <Badge
            status={status === "active" ? "done" : "error"}
            label={status?.charAt(0).toUpperCase() + status?.slice(1)}
          />
        );
      },
    },
    {
      label: "Actions",
      key: "invoiceLink",
      render: (rowData) => {
        return (
          <Button
            size="xs"
            variant="success"
            icon={<Download className="h-4 w-4" />}
            onClick={() => {
              if (rowData?.invoiceLink) {
                window.open(rowData?.invoiceLink, "_blank");
              }
            }}
          >
            Invoice
          </Button>
        );
      },
    },
  ];

  return (
    <AdminLayout isDashboard>
      {/* Summary Cards */}
      <SummaryCards
        totalSales={summary.totalSales}
        totalOrder={summary.totalOrder}
        totalStudents={summary.totalStudents}
        maxExpiredDays={summary.maxExpiredDays}
      />

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
        <ModuleHeader title="Recent Orders" isSearch={false} />

        {billingSummary?.length === 0 ? (
          <NoDataFound />
        ) : (
          <Table headers={TransactionHeaders} data={billingSummary || []} />
        )}
      </div>
    </AdminLayout>
  );
}
