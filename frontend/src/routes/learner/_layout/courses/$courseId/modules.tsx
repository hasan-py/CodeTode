import NoDataFound from "@/components/common/noDataFound";
import {
  CourseModules,
  MODULE_VIEW_COLORS,
} from "@/components/learner/course/courseModules";
import { useGetLearnerModulesQuery } from "@/hooks/query/course/learner";
import { markAsLocked } from "@/utilities/helper/markAsLocked";
import type { IModule } from "@packages/definitions";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

export const Route = createFileRoute(
  "/learner/_layout/courses/$courseId/modules"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { courseId } = Route.useParams();
  const { data, isError } = useGetLearnerModulesQuery(+courseId);

  if (data?.length === 0 || isError) {
    return (
      <div className="max-w-3/4 mx-auto">
        <NoDataFound isBack />
      </div>
    );
  }

  const overallProgress =
    data && data.length > 0
      ? Math.round(
          data.reduce(
            (sum, module) =>
              sum + ((module as IModule).progress?.progressPercentage ?? 0),
            0
          ) / data.length
        )
      : 0;

  const overAllXpEarned =
    data && data.length > 0
      ? Math.round(
          data.reduce(
            (sum, module) =>
              sum + ((module as IModule).progress?.totalXpEarned ?? 0),
            0
          )
        )
      : 0;

  return (
    <div className="max-w-3/4 mx-auto">
      <CourseModules
        onBack={() =>
          navigate({
            to: "/learner/courses",
          })
        }
        progress={overallProgress}
        xpEarned={overAllXpEarned}
        courseName={data?.[0]?.course?.name || "Course Name"}
        isLearner
        modules={markAsLocked(data || [])?.map((module, index) => ({
          title: module.name,
          description: module.description,
          icon: (
            <DynamicIcon
              name={module.iconName as IconName}
              className="h-5 w-5"
            />
          ),
          color: MODULE_VIEW_COLORS[index % MODULE_VIEW_COLORS.length],
          progress: module.progress?.progressPercentage ?? 0,
          locked: module.locked,
          courseId: +courseId,
          moduleId: +module.id,
        }))}
      />
    </div>
  );
}
