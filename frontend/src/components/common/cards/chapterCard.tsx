import { useNavigate } from "@tanstack/react-router";
import { Check, Lock, Play } from "lucide-react";

export interface IChapterCardProps {
  title: string;
  description: string;
  status: "completed" | "inProgress" | "locked";
  lessonNumber: number | string;
  progress?: number;
  isLearner?: boolean;
  ids?: {
    courseId?: number;
    moduleId?: number;
    chapterId?: number;
  };
}

export const ChapterCard: React.FC<IChapterCardProps> = ({
  title,
  description,
  status,
  lessonNumber,
  progress = 0,
  isLearner,
  ids,
}) => {
  const navigate = useNavigate();

  const getStatusInfo = () => {
    switch (status) {
      case "completed":
        return {
          bgFrom: "from-emerald-600",
          bgTo: "to-emerald-500",
          textColor: "text-emerald-100",
          icon: <Check className="h-5 w-5 text-emerald-300" />,
          progressColor: "#10B981",
          progressText: "100%",
          statusText: "Completed",
          extraIcon: (
            <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white text-sm animate-pulse">
              ✓
            </div>
          ),
        };
      case "inProgress":
        return {
          bgFrom: "from-indigo-600",
          bgTo: "to-indigo-500",
          textColor: "text-indigo-100",
          icon: <Play className="h-5 w-5 text-indigo-300" />,
          progressColor: "#6366F1",
          progressText: `${progress}%`,
          statusText: "In Progress",
          extraIcon: (
            <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-indigo-400 rounded-full flex items-center justify-center text-white text-xs">
              {lessonNumber}
            </div>
          ),
        };
      case "locked":
      default:
        return {
          bgFrom: "from-gray-700",
          bgTo: "to-gray-600",
          textColor: "text-gray-300",
          icon: <Lock className="h-5 w-5 text-gray-400" />,
          progressColor: "#6B7280",
          progressText: "0%",
          statusText: "Locked",
          extraIcon: (
            <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs">
              {lessonNumber}
            </div>
          ),
        };
    }
  };

  const {
    bgFrom,
    bgTo,
    textColor,
    icon,
    progressColor,
    progressText,
    statusText,
    extraIcon,
  } = getStatusInfo();

  return (
    <div
      onClick={() => {
        if (status === "locked") return;

        if (
          isLearner &&
          ids?.courseId &&
          ids?.moduleId &&
          ids?.chapterId &&
          progress === 100
        ) {
          return navigate({
            to: "/learner/courses/$courseId/$moduleId/$chapterId/chapter-complete",
            params: {
              courseId: ids.courseId.toString(),
              moduleId: ids.moduleId.toString(),
              chapterId: ids.chapterId.toString(),
            },
          });
        }

        return isLearner && ids?.courseId && ids?.moduleId && ids?.chapterId
          ? navigate({
              to: "/learner/courses/$courseId/$moduleId/$chapterId/lesson",
              resetScroll: true,
              params: {
                courseId: ids.courseId?.toString(),
                moduleId: ids.moduleId?.toString(),
                chapterId: ids.chapterId?.toString(),
              },
            })
          : navigate({
              to: "/learner/courses/$courseId/$moduleId/$chapterId/lesson",
              resetScroll: true,
              params: {
                courseId: "course1",
                moduleId: "module1",
                chapterId: "chapter1",
              },
            });
      }}
      className={`bg-gradient-to-r ${bgFrom} ${bgTo} rounded-2xl p-5 ${
        status !== "locked"
          ? "hover:scale-105 transition-all duration-300 cursor-pointer transform hover:rotate-1"
          : "opacity-75 cursor-not-allowed"
      } flex items-center justify-between`}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div
            className={`w-12 h-12 ${
              status === "locked" ? "bg-gray-800" : `${bgFrom}/50`
            } rounded-full flex items-center justify-center ${
              status === "completed" ? "ring-4 ring-emerald-500/30" : ""
            }`}
          >
            {icon}
          </div>
          {extraIcon}
        </div>
        <div>
          <h3 className={`font-bold text-xl text-white`}>{title}</h3>
          <p className={textColor}>{description}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10">
          <svg className="transform -rotate-90 w-10 h-10">
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="#374151"
              strokeWidth="3"
              fill="none"
            ></circle>
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke={progressColor}
              strokeWidth="3"
              fill="none"
              strokeDasharray="100.53"
              strokeDashoffset={
                status === "inProgress"
                  ? 100.53 - (progress / 100) * 100.53
                  : status === "completed"
                  ? 0
                  : 100.53
              }
            ></circle>
          </svg>
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-white">
            {progressText}
          </span>
        </div>
        <span className={textColor + " font-medium"}>{statusText}</span>
      </div>
    </div>
  );
};
