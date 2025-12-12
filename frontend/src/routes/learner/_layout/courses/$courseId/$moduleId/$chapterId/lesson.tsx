import Loading from "@/components/common/loading";
import MainLesson from "@/components/learner/lesson/mainLesson";
import { useGetLearnerCurrentLessonQuery } from "@/hooks/query/course/learner";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/learner/_layout/courses/$courseId/$moduleId/$chapterId/lesson"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { courseId, moduleId, chapterId } = Route.useParams();
  const search = Route.useSearch() as { lessonId?: string };
  const lessonId = search.lessonId;

  const { data: currentLessonData, isLoading } =
    useGetLearnerCurrentLessonQuery(+courseId, +moduleId, +chapterId, lessonId);

  const data = currentLessonData;
  const isCurrentLesson = !data?.lesson?.isLocked && !data?.lesson?.isCompleted;

  const onCompleteHandler = async () => {};

  const onPreviousHandler = () => {};

  if (isLoading) {
    return <Loading fullscreen />;
  }

  return (
    <>
      <MainLesson
        data={data}
        isCurrent={isCurrentLesson}
        isLoading={isLoading}
        isFooter={true}
        onComplete={onCompleteHandler}
        onBack={() =>
          navigate({
            to: "/learner/courses/$courseId/$moduleId/chapters",
            params: { courseId, moduleId },
          })
        }
        onPrevious={
          data?.navigation.previousLesson?.id ? onPreviousHandler : undefined
        }
      />
    </>
  );
}
