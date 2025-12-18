import type { ICourseEnrollmentSummary } from "@packages/definitions";

export function getDashboardOverviewSummary(
  billingSummary: ICourseEnrollmentSummary[]
) {
  let totalSales = 0;
  let totalOrder = 0;
  const studentSet = new Set<number>();
  let maxExpired = 0;

  for (const item of billingSummary || []) {
    totalSales += +item.totalPrice;
    totalOrder++;
    if (item.user?.id) studentSet.add(item.user.id);
    const expiredAt = new Date(item.expiresAt).getTime();
    if (expiredAt > maxExpired) maxExpired = expiredAt;
  }

  return {
    totalSales,
    totalOrder,
    totalStudents: studentSet.size,
    maxExpiredDays: maxExpired
      ? new Date(maxExpired).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        })
      : "N/A",
  };
}
