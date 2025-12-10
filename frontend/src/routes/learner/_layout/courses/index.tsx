import Loading from "@/components/common/loading";
import ActiveCourses from "@/components/learner/course/activeCourses";
import LearnerInfoHeader from "@/components/learner/course/learnerInfoHeader";
import { useAuthController } from "@/hooks/controller/account/useAuthController";
import { useGetLearnerActiveCoursesQuery } from "@/hooks/query/course/learner";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learner/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthController();

  const { data: courses, isLoading } = useGetLearnerActiveCoursesQuery();

  if (isLoading) {
    return <Loading fullscreen />;
  }

  return (
    <div className="max-w-3/4 mx-auto space-y-4">
      <LearnerInfoHeader
        user={user}
        isCoursePurchaseBanner={user?.courseEnrollments?.length === 0}
      />

      <ActiveCourses courses={courses || []} />
    </div>
  );
}
