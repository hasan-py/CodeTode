import { FeaturedCourses } from "@/components/website/home/featuredCourses";
import { usePublishedCourseController } from "@/hooks/controller/course/usePublishedCourseController";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(website)/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { courses, isLoading } = usePublishedCourseController();

  return (
    <div className="mb-8">
      <FeaturedCourses courses={courses} isLoading={isLoading} />
    </div>
  );
}
