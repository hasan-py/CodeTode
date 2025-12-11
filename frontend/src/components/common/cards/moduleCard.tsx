import { useNavigate } from "@tanstack/react-router";
import { LockIcon } from "lucide-react";

export interface IModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
  locked?: boolean;
  isLearner?: boolean;
  courseId?: number;
  moduleId?: number;
}

export default function ModuleCard({
  title,
  description,
  icon,
  color,
  progress,
  locked = false,
  isLearner = false,
  courseId,
  moduleId,
}: IModuleCardProps) {
  const navigate = useNavigate();

  const getColorClasses = (color: string) => {
    const colorMap: Record<
      string,
      {
        bg: string;
        text: string;
        border: string;
        iconBg: string;
        progressBg: string;
      }
    > = {
      green: {
        bg: "bg-green-50 dark:bg-green-900/20",
        text: "text-green-700 dark:text-green-400",
        border:
          "border-green-300 hover:border-green-500 dark:border-green-700/50 dark:hover:border-green-500/70",
        iconBg: "bg-green-200 dark:bg-green-900/50",
        progressBg: "bg-green-500",
      },
      yellow: {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        text: "text-yellow-800 dark:text-yellow-400",
        border:
          "border-yellow-300 hover:border-yellow-500 dark:border-yellow-700/50 dark:hover:border-yellow-500/70",
        iconBg: "bg-yellow-200 dark:bg-yellow-900/50",
        progressBg: "bg-yellow-500",
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        text: "text-purple-800 dark:text-purple-400",
        border:
          "border-purple-300 hover:border-purple-500 dark:border-purple-700/50 dark:hover:border-purple-500/70",
        iconBg: "bg-purple-200 dark:bg-purple-900/50",
        progressBg: "bg-purple-500",
      },
      blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-800 dark:text-blue-400",
        border:
          "border-blue-300 hover:border-blue-500 dark:border-blue-700/50 dark:hover:border-blue-500/70",
        iconBg: "bg-blue-200 dark:bg-blue-900/50",
        progressBg: "bg-blue-500",
      },
      red: {
        bg: "bg-red-50 dark:bg-red-900/20",
        text: "text-red-800 dark:text-red-400",
        border:
          "border-red-300 hover:border-red-500 dark:border-red-700/50 dark:hover:border-red-500/70",
        iconBg: "bg-red-200 dark:bg-red-900/50",
        progressBg: "bg-red-500",
      },
      orange: {
        bg: "bg-orange-50 dark:bg-orange-900/20",
        text: "text-orange-800 dark:text-orange-400",
        border:
          "border-orange-300 hover:border-orange-500 dark:border-orange-700/50 dark:hover:border-orange-500/70",
        iconBg: "bg-orange-200 dark:bg-orange-900/50",
        progressBg: "bg-orange-500",
      },
      pink: {
        bg: "bg-pink-50 dark:bg-pink-900/20",
        text: "text-pink-800 dark:text-pink-400",
        border:
          "border-pink-300 hover:border-pink-500 dark:border-pink-700/50 dark:hover:border-pink-500/70",
        iconBg: "bg-pink-200 dark:bg-pink-900/50",
        progressBg: "bg-pink-500",
      },
      indigo: {
        bg: "bg-indigo-50 dark:bg-indigo-900/20",
        text: "text-indigo-800 dark:text-indigo-400",
        border:
          "border-indigo-300 hover:border-indigo-500 dark:border-indigo-700/50 dark:hover:border-indigo-500/70",
        iconBg: "bg-indigo-200 dark:bg-indigo-900/50",
        progressBg: "bg-indigo-500",
      },
    };

    return colorMap[color] || colorMap.indigo;
  };

  const colors = getColorClasses(color);

  return (
    <div
      onClick={() => {
        if (courseId && moduleId && isLearner && !locked) {
          navigate({
            to: "/learner/courses/$courseId/$moduleId/chapters",
            params: {
              courseId: courseId.toString(),
              moduleId: moduleId.toString(),
            },
            resetScroll: true,
          });
        }
      }}
      className={`${
        colors.bg
      } rounded-xl p-4 transform hover:scale-[1.02] transition-all cursor-pointer border ${
        colors.border
      } ${locked ? "opacity-90 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`${colors.iconBg} rounded-full p-3 mr-4 ${colors.text}`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center">
              {title}
              {locked && (
                <div className="ml-2 bg-gray-200 dark:bg-gray-800 rounded-full p-1">
                  <LockIcon className="h-3 w-3" />
                </div>
              )}
            </h3>
            <p className={colors.text + " truncate w-24 md:w-96"}>
              {description}
            </p>
          </div>
        </div>

        {progress !== undefined ? (
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${colors.progressBg}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
