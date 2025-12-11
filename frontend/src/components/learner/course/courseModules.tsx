import type { IModuleCardProps } from "@/components/common/cards/moduleCard";
import ModuleCard from "@/components/common/cards/moduleCard";
import { MaterialsProgress } from "./materialsProgress";

export interface ICourseModulesProps {
  courseName?: string;
  modules?: IModuleCardProps[];
  isLearner?: boolean;
  progress?: number | undefined;
  xpEarned?: number;
  onBack?: () => void;
}

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

export const CourseModules: React.FC<ICourseModulesProps> = ({
  courseName,
  modules = [],
  isLearner = false,
  onBack,
  progress,
  xpEarned,
}) => {
  return (
    <div className="bg-white dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
      <MaterialsProgress
        name={courseName}
        type="Module"
        progress={progress}
        xpEarned={xpEarned}
        onBack={onBack}
      />

      <div className="space-y-4">
        {modules?.map((module, index) => (
          <ModuleCard isLearner={isLearner} key={index} {...module} />
        ))}
      </div>
    </div>
  );
};
