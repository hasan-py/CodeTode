import Button from "@/components/common/button";
import { ArrowLeft, Star, Trophy } from "lucide-react";

interface IMaterialsProgressProps {
  name?: string;
  isLearner?: boolean;
  progress?: number | undefined;
  xpEarned?: number;
  type?: "Course" | "Module" | "Chapter";
  onBack?: () => void;
}

export function MaterialsProgress({
  name,
  type = "Course",
  progress,
  xpEarned,
  onBack,
}: IMaterialsProgressProps) {
  return (
    <>
      <div className="flex">
        {onBack ? (
          <div className="mr-4">
            <Button variant="secondary" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </Button>
          </div>
        ) : null}

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {name}
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
            {type} Progress: {progress}%
          </span>
          <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
            <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400 inline mr-2" />{" "}
            {xpEarned} Xp Earned
          </span>
        </div>
      ) : null}
    </>
  );
}
