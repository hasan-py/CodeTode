import Loading from "@/components/common/loading";
import NoDataFound from "@/components/common/noDataFound";
import type { ICourse } from "@packages/definitions";
import { Link } from "@tanstack/react-router";

export interface ISectionProps {
  title?: string;
  description?: string;
}

interface ICourseWithEnrollLink extends Omit<ICourse, "enrollLink"> {
  enrollLink?: { to: string; label: string } | null;
}

interface IFeaturedCoursesProps extends ISectionProps {
  viewAllLink?: { to: string; label: string } | null;
  courses?: ICourseWithEnrollLink[];
  isLoading?: boolean;
}

export function FeaturedCourses({
  title = "Featured Courses",
  viewAllLink = { to: "/courses", label: "View All Courses →" },
  courses,
  isLoading,
}: IFeaturedCoursesProps) {
  return (
    <section className="pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {viewAllLink !== null ? (
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>

            <Link
              to={viewAllLink.to}
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
            >
              {viewAllLink.label}
            </Link>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>

        {courses?.length === 0 && !isLoading ? <NoDataFound /> : null}

        {isLoading ? <Loading text="Loading Courses" /> : null}
      </div>
    </section>
  );
}

export function CourseCard({
  name,
  description,
  moduleCount,
  chapterCount,
  lessonCount,
  validityYear,
  price,
  enrollLink,
}: ICourseWithEnrollLink) {
  return (
    <div className="group">
      <div className="bg-gradient-to-r from-white to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm rounded-2xl  overflow-hidden transform transition-all duration-300 group-hover:shadow-indigo-300/20 dark:group-hover:shadow-indigo-500/20 group-hover: border border-gray-200 dark:border-gray-700 group-hover:border-indigo-400/50 dark:group-hover:border-indigo-500/50">
        <div className="h-3 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 min-h-[3.5rem] dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {name}
          </h3>
          <p className="mt-3 text-gray-700 dark:text-gray-400 line-clamp-3 truncate">
            {description}
          </p>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Total Modules:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {moduleCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Chapters:
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {chapterCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lessons:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {lessonCount}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Link
              to={enrollLink?.to}
              className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:shadow-indigo-300/40 dark:shadow-indigo-500/20 dark:hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-purple-500"
            >
              {enrollLink?.label}
            </Link>

            <div className="mt-6 flex items-baseline">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {price}
              </span>
              <span className="text-gray-600 dark:text-gray-500 ml-2">
                {`/ ${validityYear} year`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
