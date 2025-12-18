import { useGetLeaderboardQuery } from "@/hooks/query/course/learner";
import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Zap } from "lucide-react";

export const Route = createFileRoute("/(website)/_layout/leaderboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useGetLeaderboardQuery();

  const sortedUsers = data?.length
    ? [...data].sort((a, b) => (a.totalXp > b.totalXp ? -1 : 1))
    : [];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Global Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          See how you stack up against other learners from around the world.
          This data updates on every hour.
        </p>
      </div>

      {/* Leaderboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedUsers.map((user, index) => (
          <div
            key={user.userId}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center"
          >
            {/* Rank */}
            <div
              className={`text-2xl font-bold mb-4 ${
                index + 1 === 1
                  ? "text-yellow-500 dark:text-yellow-400"
                  : index + 1 === 2
                  ? "text-slate-500 dark:text-slate-400"
                  : index + 1 === 3
                  ? "text-amber-700 dark:text-amber-600"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              #{index + 1}
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0 h-20 w-20 rounded-full overflow-hidden border-4 border-blue-500 dark:border-blue-600 mb-4">
              <img
                className="h-full w-full object-cover"
                src={user.imageUrl || "/placeholder.svg"}
                alt={user.name}
              />
            </div>

            {/* User Info */}
            <span
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-2 truncate w-full"
              title={user.name}
            >
              {user.name}
            </span>

            {/* Stats */}
            <div className="flex justify-around w-full text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                {user.currentStreak} days
              </div>
              <div className="flex items-center">
                <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                {user.totalXp} XP
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
