import Badge from "@/components/common/badge";
import Button from "@/components/common/button";
import ModuleHeader from "@/components/common/layout/moduleHeader";
import Loading from "@/components/common/loading";
import NoDataFound from "@/components/common/noDataFound";
import type { ITableHeader } from "@/components/common/table";
import Table from "@/components/common/table";
import { useGetLearnerBillingSummaryQuery } from "@/hooks/query/course/learner";
import type { ICourseEnrollmentSummary } from "@packages/definitions";
import { Logger } from "@packages/logger";
import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";

export const Route = createFileRoute("/learner/_layout/billing")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: summary, isLoading } = useGetLearnerBillingSummaryQuery();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  const transactionHeaders: ITableHeader<ICourseEnrollmentSummary>[] = [
    {
      label: "Course",
      key: "course",
      render: (rowData: ICourseEnrollmentSummary) => {
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
      label: "Price",
      key: "totalPrice",
      cellClass: "text-sm text-gray-300",
      render: (rowData: ICourseEnrollmentSummary) => `$${rowData?.totalPrice}`,
    },
    {
      label: "Enrolled Date",
      key: "createdAt",
      cellClass: "text-sm text-gray-400",
      render: (rowData: ICourseEnrollmentSummary) =>
        new Date(rowData?.createdAt).toLocaleDateString(),
    },
    {
      label: "Expire Date",
      key: "expiresAt",
      cellClass: "text-sm text-gray-400",
      render: (rowData: ICourseEnrollmentSummary) =>
        new Date(rowData?.expiresAt).toLocaleDateString(),
    },
    {
      label: "Status",
      key: "status",
      render: (
        _: ICourseEnrollmentSummary,
        statusValue: ICourseEnrollmentSummary[keyof ICourseEnrollmentSummary]
      ) => {
        Logger.debug("statusValue", statusValue);
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
      render: (rowData: ICourseEnrollmentSummary) => {
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
    <div className="max-w-3/4 mx-auto">
      <div className="bg-white/90 dark:bg-gray-700/30 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <ModuleHeader isSearch={false}>
          <h1 className="text-2xl font-semibold">Billing History</h1>
        </ModuleHeader>

        {summary?.length === 0 ? (
          <NoDataFound />
        ) : (
          <Table headers={transactionHeaders} data={summary || []} />
        )}
      </div>
    </div>
  );
}
