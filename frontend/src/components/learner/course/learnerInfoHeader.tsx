import Button from "@/components/common/button";
import type { IUser } from "@packages/definitions";

function LearnerInfoHeader({
  isCoursePurchaseBanner,
  user,
}: {
  isCoursePurchaseBanner?: boolean;
  user: IUser | null;
}) {
  const CoursePurchaseBanner = (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg my-4">
      <Button
        className="my-2"
        onClick={() => (window.location.href = "/courses")}
      >
        Visit All Courses
      </Button>
      <p className="text-sm">Enroll now and start your learning journey!</p>
    </div>
  );

  return (
    <div className="text-center mb-8">
      {isCoursePurchaseBanner ? CoursePurchaseBanner : null}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xl font-bold">
            JD
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Keep up the great work
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {user?.totalXp || 0}
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total XP</p>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-amber-500 dark:text-amber-400">
              🔥 {user?.currentStreak || 0}
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Day Streak
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LearnerInfoHeader;
