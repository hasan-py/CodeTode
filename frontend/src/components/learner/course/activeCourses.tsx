import Button from "@/components/common/button";
import ModuleHeader from "@/components/common/layout/moduleHeader";
import NoDataFound from "@/components/common/noDataFound";
import type { ICourseEnrollmentSummary } from "@packages/definitions";
import { Link } from "@tanstack/react-router";

function ActiveCourses({
  courses,
  isLoading,
}: {
  courses: ICourseEnrollmentSummary[];
  isLoading?: boolean;
}) {
  const colorArray = ["indigo", "cyan", "blue", "purple", "green"];
  const getCourseColorClass = (color: string) => {
    switch (color) {
      case "indigo":
        return "from-indigo-400 to-indigo-700";
      case "cyan":
        return "from-cyan-400 to-cyan-700";
      case "blue":
        return "from-blue-400 to-blue-700";
      case "purple":
        return "from-purple-400 to-purple-700";
      case "green":
        return "from-green-400 to-green-700";
      default:
        return "from-indigo-400 to-indigo-700";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <ModuleHeader isSearch={false}>
        <h1 className="text-2xl font-semibold">Active Courses</h1>
      </ModuleHeader>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {courses?.map(({ course, progress, learnerProgress }, index) => (
          <div
            key={course?.id}
            className="bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 group"
          >
            <div
              className={`h-2 bg-gradient-to-r ${getCourseColorClass(
                colorArray[index % colorArray.length]
              )}`}
            ></div>
            <div className="p-5">
              <div className="flex mb-4">
                {course?.imageUrl ? (
                  <div className="w-[20%] rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center mr-4 overflow-hidden">
                    <img
                      src={course?.imageUrl}
                      alt={course?.name}
                      className="h-16 w-16 object-cover"
                    />
                  </div>
                ) : null}
                <div className="w-[80%]">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors h-6 overflow-hidden truncate">
                    {course?.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 h-8 overflow-hidden line-clamp-2">
                    {course?.description}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">
                    {progress?.completedLessons}/{progress?.totalLessons}{" "}
                    Lessons
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {progress?.progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${getCourseColorClass(
                      colorArray[index % colorArray.length]
                    )} rounded-full h-2`}
                    style={{ width: `${progress?.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                    {progress?.totalXpEarned} XP
                  </span>{" "}
                  earned
                </div>
                <div className="space-x-2">
                  <Link
                    to="/learner/courses/$courseId/$moduleId/$chapterId/lesson"
                    params={{
                      courseId: course?.id?.toString(),
                      moduleId: learnerProgress?.moduleId?.toString(),
                      chapterId: learnerProgress?.chapterId?.toString(),
                    }}
                  >
                    <Button size="sm">Continue</Button>
                  </Link>

                  <Link
                    to="/learner/courses/$courseId/modules"
                    params={{ courseId: course?.id.toString() }}
                  >
                    <Button variant="secondary" size="sm">
                      Explore
                    </Button>
                  </Link>
                </div>
              </div>

              {/* <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Next:
                  </span>{" "}
                  {course?.nextLesson}
                </div>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {course?.estimatedTime}
                </div>
              </div> */}
            </div>
          </div>
        ))}
      </div>

      {!courses?.length && !isLoading ? <NoDataFound /> : null}
    </div>
  );
}

export default ActiveCourses;
