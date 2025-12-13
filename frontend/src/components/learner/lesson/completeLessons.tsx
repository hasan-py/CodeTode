import type { ICompletedLesson } from "@packages/definitions";
import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";

type CompletedLessonType = ICompletedLesson["completedLessons"] | undefined;

export default function CompleteLessons({
  lessons,
}: {
  lessons: CompletedLessonType;
}) {
  const navigate = useNavigate();
  return (
    <div className="mt-8">
      <div className="space-y-4">
        {lessons?.map((lesson, index) => (
          <div
            onClick={() => {
              navigate({
                to: "/learner/courses/$courseId/$moduleId/$chapterId/lesson",
                params: {
                  courseId: lesson?.courseId.toString(),
                  moduleId: lesson?.moduleId.toString(),
                  chapterId: lesson?.chapterId.toString(),
                },
                search: {
                  lessonId: lesson?.lessonId,
                },
              });
            }}
            key={index}
            className="bg-emerald-50 dark:bg-gray-800 rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 flex items-center justify-between cursor-pointer border border-emerald-200 dark:border-emerald-600/30"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-800/50 rounded-full flex items-center justify-center ring-2 ring-emerald-300/50 dark:ring-emerald-500/30">
                  <Check className="h-7 w-7 text-emerald-500 dark:text-emerald-400" />
                </div>
                <div className="absolute -right-1 -bottom-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">
                  {index + 1}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  {index + 1}. {lesson.lessonName}
                </h3>
                <p className="text-emerald-600 dark:text-emerald-300">
                  {lesson.lessonDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <svg className="transform -rotate-90 w-10 h-10">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                    fill="none"
                    className="dark:stroke-[#374151]"
                  ></circle>
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="#10B981"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="100.53"
                    strokeDashoffset="0"
                  ></circle>
                </svg>
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-medium text-gray-900 dark:text-white">
                  100%
                </span>
              </div>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Completed
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
