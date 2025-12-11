import NoDataFound from "@/components/common/noDataFound";
import { CourseChapters } from "@/components/learner/course/courseChapters";
import { useGetLearnerChapterQuery } from "@/hooks/query/course/learner";
import { markAsLocked } from "@/utilities/helper/markAsLocked";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";

export const Route = createFileRoute(
  "/learner/_layout/courses/$courseId/$moduleId/chapters"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { courseId, moduleId } = Route.useParams();
  const { data, isError } = useGetLearnerChapterQuery(+courseId, +moduleId);

  const { totalXpEarned, overallProgress } = useMemo(() => {
    if (!data || isError || data.length === 0) {
      return {
        totalXpEarned: 0,
        overallProgress: 0,
      };
    }
    const result = data.reduce(
      (acc, chapter) => {
        acc.totalCompleted += chapter.progress?.completedLessons ?? 0;
        acc.totalLessons += chapter.progress?.totalLessons ?? 0;
        acc.totalXpEarned += chapter.progress?.totalXpEarned ?? 0;
        return acc;
      },
      { totalCompleted: 0, totalLessons: 0, totalXpEarned: 0 }
    );
    return {
      ...result,
      overallProgress:
        result.totalLessons > 0
          ? Math.round((result.totalCompleted / result.totalLessons) * 100)
          : 0,
    };
  }, [data, isError]);

  if (isError || data?.length === 0) {
    return (
      <div className="max-w-3/4 mx-auto">
        <NoDataFound isBack />
      </div>
    );
  }

  return (
    <div className="max-w-3/4 mx-auto">
      <CourseChapters
        onBack={() =>
          navigate({
            to: "/learner/courses/$courseId/modules",
            params: { courseId },
          })
        }
        progress={overallProgress}
        xpEarned={totalXpEarned}
        moduleName={data?.[0]?.module?.name || ""}
        isLearner
        chapters={
          data
            ? markAsLocked(data).map((chapter) => ({
                title: chapter.name,
                description: chapter.description,
                status:
                  chapter.progress?.progressPercentage === 100
                    ? "completed"
                    : chapter.locked
                    ? "locked"
                    : "inProgress",
                lessonNumber: chapter.position,
                progress: chapter.progress?.progressPercentage ?? 0,
                ids: {
                  courseId: +courseId,
                  moduleId: +moduleId,
                  chapterId: chapter.id,
                },
              }))
            : []
        }
      />
    </div>
  );
}
