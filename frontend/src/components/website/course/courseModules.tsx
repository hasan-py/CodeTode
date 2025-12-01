import Button from "@/components/common/button";
import { ArrowLeft, Star, Trophy } from "lucide-react";
import ModuleCard, { type IModuleCardProps } from "./moduleCard";

export const MODULE_VIEW_COLORS = [
  "green",
  "blue",
  "yellow",
  "purple",
  "red",
  "orange",
  "pink",
  "indigo",
];

export interface CourseModulesProps {
  courseName?: string;
  modules?: IModuleCardProps[];
  isLearner?: boolean;
  progress?: number | undefined;
  xpEarned?: number;
  onBack?: () => void;
}

export const CourseModules: React.FC<CourseModulesProps> = ({
  courseName,
  modules = [],
  isLearner = false,
  onBack,
  progress,
  xpEarned,
}) => {
  return (
    <div className="bg-white dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
      <div className="flex">
        {onBack ? (
          <div className="mr-4">
            <Button variant="secondary" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </Button>
          </div>
        ) : null}

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {courseName}
        </h2>
      </div>

      {progress !== undefined && progress >= 0 ? (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 my-4">
          <div
            className="bg-emerald-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      ) : null}

      {progress !== undefined &&
      progress >= 0 &&
      xpEarned !== undefined &&
      xpEarned >= 0 ? (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2 mb-6 flex-wrap gap-4">
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />{" "}
            Chapter Progress: {progress}%
          </span>
          <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400 inline mr-2" />{" "}
            {xpEarned} Xp Earned
          </span>
        </div>
      ) : null}

      <div className="space-y-4">
        {modules.map((module, index) => (
          <ModuleCard isLearner={isLearner} key={index} {...module} />
        ))}
      </div>
    </div>
  );
};
