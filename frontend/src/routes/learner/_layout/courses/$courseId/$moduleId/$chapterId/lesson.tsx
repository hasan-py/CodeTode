import Loading from "@/components/common/loading";
import MainLesson from "@/components/learner/lesson/mainLesson";
import {
  useGetLearnerAccessibleLessonQuery,
  useGetLearnerCurrentLessonQuery,
  useLessonCompleteMutation,
} from "@/hooks/query/course/learner";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";

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

  const { data: accessibleLessonData } =
    useGetLearnerAccessibleLessonQuery(lessonId);

  const { mutateAsync: completeLessonMutation, isPending } =
    useLessonCompleteMutation({
      courseId: +courseId,
      moduleId: +moduleId,
      chapterId: +chapterId,
    });

  const data = lessonId ? accessibleLessonData : currentLessonData;
  const isCurrentLesson = !data?.lesson?.isLocked && !data?.lesson?.isCompleted;

  const onCompleteHandler = async () => {
    if (!data?.lesson?.id || isPending) return;

    if (!isCurrentLesson && data.navigation?.nextLesson?.id) {
      return navigate({
        to: "/learner/courses/$courseId/$moduleId/$chapterId/lesson",
        params: { courseId, moduleId, chapterId },
        search: {
          lessonId: data.navigation?.nextLesson?.id,
        },
      });
    }

    if (!data?.lesson?.isCompleted) {
      await toast.promise(completeLessonMutation(data?.lesson?.id), {
        loading: "Loading...",
        success: "Lesson completed!",
        error: "Failed to complete lesson",
      });
    }

    if (
      data?.progress?.totalLessons - 1 === data?.progress?.completedLessons ||
      !data?.navigation?.nextLesson
    ) {
      navigate({
        to: "/learner/courses/$courseId/$moduleId/$chapterId/chapter-complete",
        params: { courseId, moduleId, chapterId },
      });
    } else {
      navigate({
        to: "/learner/courses/$courseId/$moduleId/$chapterId/lesson",
        params: { courseId, moduleId, chapterId },
        search: {},
      });
    }
  };

  const onPreviousHandler = () => {
    if (data?.navigation.previousLesson) {
      navigate({
        to: "/learner/courses/$courseId/$moduleId/$chapterId/lesson",
        params: { courseId, moduleId, chapterId },
        search: {
          lessonId: data.navigation?.previousLesson?.id,
        },
      });
    }
  };

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
