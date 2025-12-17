import type { TFormattedLearnerInfo } from "@packages/definitions";
import { BookOpen, DollarSign, Flame, Users, Zap } from "lucide-react";
import Badge from "../common/badge";

function LearnerList({ learners }: { learners?: TFormattedLearnerInfo[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {learners && learners?.length > 0 ? (
        learners?.map((learner, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 bg-white hover:bg-gray-100 transition-colors hover:shadow-lg
                     dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div
                  className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden
                              dark:bg-gray-700"
                >
                  <img
                    src={learner.imageUrl || "/placeholder.svg"}
                    alt={learner.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-lg text-gray-900 dark:text-white">
                    {learner.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Member since: {learner.memberSince}
                  </p>
                </div>
              </div>

              <Badge
                label={learner.status === "Active" ? "Active" : "Inactive"}
                status={learner.status === "Active" ? "done" : "error"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div
                className="bg-gray-100/50 p-3 rounded-lg border border-gray-200
                            dark:bg-gray-700/50 dark:border-gray-700"
              >
                <div className="flex items-center mb-1">
                  <BookOpen className="h-4 w-4 text-indigo-600 mr-2 dark:text-indigo-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enrolled Courses
                  </p>
                </div>
                <p className="font-semibold text-lg text-gray-900 dark:text-white">
                  {learner.enrolledCourses}
                </p>
              </div>
              <div
                className="bg-gray-100/50 p-3 rounded-lg border border-gray-200
                            dark:bg-gray-700/50 dark:border-gray-700"
              >
                <div className="flex items-center mb-1">
                  <Zap className="h-4 w-4 text-indigo-600 mr-2 dark:text-indigo-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total XP
                  </p>
                </div>
                <p className="font-semibold text-lg text-gray-900 dark:text-white">
                  {learner.totalXp}
                </p>
              </div>
              <div
                className="bg-gray-100/50 p-3 rounded-lg border border-gray-200
                            dark:bg-gray-700/50 dark:border-gray-700"
              >
                <div className="flex items-center mb-1">
                  <Flame className="h-4 w-4 text-indigo-600 mr-2 dark:text-indigo-400" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current Streak
                  </p>
                </div>
                <p className="font-semibold text-lg text-gray-900 dark:text-white">
                  {learner.currentStreak} days
                </p>
              </div>
            </div>
            <hr className="my-6 border-gray-200 dark:border-gray-700" />
            <div className="mb-4">
              {learner.currentProgressList.map((course, idx) => (
                <div key={idx} className="mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.name}
                  </p>
                  <div className="relative w-full bg-gray-200 rounded-full h-2 mt-2 dark:bg-gray-700">
                    <div
                      className="w-full bg-emerald-500 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                    <span className="absolute right-0 -top-5 text-xs text-gray-500 dark:text-gray-400">
                      {`${course.progress.toFixed(0)}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-indigo-600 mr-2 dark:text-indigo-400" />
                <p className="text-sm text-gray-600 mr-2 dark:text-gray-400">
                  Total Spent:
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {learner.totalSpent}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4 dark:bg-gray-700">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
            No learners found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}

export default LearnerList;
