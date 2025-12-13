import Loading from "@/components/common/loading";
import CompleteLessons from "@/components/learner/lesson/completeLessons";
import CompletionBanner from "@/components/learner/lesson/completionBanner";
import { useGetCompletedLessonsQuery } from "@/hooks/query/course/learner";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/learner/_layout/courses/$courseId/$moduleId/$chapterId/chapter-complete"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { chapterId, courseId, moduleId } = Route.useParams();
  const { data: completedLessons, isLoading } = useGetCompletedLessonsQuery(
    +chapterId
  );

  if (isLoading) {
    return <Loading fullscreen />;
  }

  return (
    <div className="bg-white dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 max-w-5xl mx-auto rounded-2xl  p-8 mb-8 border border-gray-200 dark:border-gray-700">
      <CompletionBanner
        title={`Chapter Completed! ${
          completedLessons?.completedLessons[0].chapterName || ""
        }`}
        description={`${
          completedLessons?.completedLessons[0].courseName || ""
        } • ${completedLessons?.completedLessons[0].moduleName || ""}`}
        starsEarned={
          completedLessons?.completedLessons?.reduce(
            (acc, lesson) => acc + lesson.xpEarned,
            0
          ) || 0
        }
        onClickNextChapter={() =>
          navigate({
            to: "/learner/courses/$courseId/$moduleId/chapters",
            params: {
              moduleId: moduleId.toString(),
              courseId: courseId.toString(),
            },
          })
        }
      />

      <CompleteLessons lessons={completedLessons?.completedLessons} />
    </div>
  );
}
