import { useGetPublishedCoursesQuery } from "@/hooks/query/course";

export function usePublishedCourseController() {
  const { data, isLoading } = useGetPublishedCoursesQuery();

  const courses = data?.courses?.map((course) => ({
    ...course,
    enrollLink: {
      to: `/courses/${course.id}`,
      label: "View Details",
    },
  }));

  return { courses, isLoading };
}
