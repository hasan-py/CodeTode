import { FeaturedCourses } from "@/components/website/home/featuredCourses";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(website)/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mb-8">
      <FeaturedCourses viewAllLink={null} courses={[]} />
    </div>
  );
}
