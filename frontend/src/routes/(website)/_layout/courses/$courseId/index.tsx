import Loading from "@/components/common/loading";
import {
  CourseModules,
  MODULE_VIEW_COLORS,
} from "@/components/learner/course/courseModules";
import { CourseHeader } from "@/components/website/course/courseHeader";
import { CoursePricing } from "@/components/website/course/coursePricing";
import { useAuthController } from "@/hooks/controller/account/useAuthController";
import { useLemonSqueezyCheckout } from "@/hooks/controller/course/lemonSqueezyCheckoutUrl";
import { useGetCourseQuery } from "@/hooks/query/course";
import { EUserRole } from "@packages/definitions";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";

export const Route = createFileRoute("/(website)/_layout/courses/$courseId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const { courseId } = Route.useParams();
  const { user } = useAuthController();
  const { checkout, checkoutLoading } = useLemonSqueezyCheckout();

  const isCoursePurchased = user?.courseEnrollments?.includes(+courseId);

  const { data: course, isLoading } = useGetCourseQuery(+courseId, true);

  if (isLoading) {
    return <Loading fullscreen />;
  }

  if (!course && !isLoading) {
    return <Navigate to="/courses" />;
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CourseHeader
          data={{
            title: course?.name,
            modules: `${course?.modules?.length} Modules`,
            chapters: `${course?.chapterCount} Chapters`,
            lessons: `${course?.lessonCount} Lessons`,
            quizzes: `${course?.quizCount} Quizzes`,
            description: course?.description,
            imageUrl: course?.imageUrl,
            isSignedIn: !!user,
            onEnroll: () => {
              checkout(course?.enrollLink, user, course?.id);
            },
            onPreview: () => {
              navigate({
                to: `/learner/courses/${courseId}/modules`,
                params: { courseId },
              });
            },
            onEnrollLoading: checkoutLoading,
            isCoursePurchased,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CourseModules
              modules={course?.modules?.map((module, index) => ({
                title: module.name,
                description: module.description,
                icon: (
                  <DynamicIcon
                    name={module.iconName as IconName}
                    className="h-5 w-5"
                  />
                ),
                color: MODULE_VIEW_COLORS[index % MODULE_VIEW_COLORS.length],
                locked: !isCoursePurchased ? true : index !== 0,
                moduleId: module?.id,
                courseId: module?.courseId,
                isLearner: user?.role === EUserRole.LEARNER,
              }))}
            />
          </div>

          {!isCoursePurchased ? (
            <div className="lg:col-span-1">
              <div className="sticky top-28 flex-col space-y-8">
                <CoursePricing
                  data={{
                    price: `$${course?.price.toString()}`,
                    pricePeriod: `/ ${course?.validityYear} year`,
                    onEnroll: isCoursePurchased
                      ? undefined
                      : () => checkout(course?.enrollLink, user, course?.id),
                    loading: checkoutLoading,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
