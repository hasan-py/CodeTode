import {
  ChapterCard,
  type IChapterCardProps,
} from "@/components/common/cards/chapterCard";
import { MaterialsProgress } from "./materialsProgress";

export function CourseChapters({
  isLearner,
  chapters,
  onBack,
  moduleName,
  progress,
  xpEarned,
}: {
  isLearner?: boolean;
  chapters: IChapterCardProps[];
  moduleName?: string;
  progress?: number | undefined;
  xpEarned?: number;
  onBack?: () => void;
}) {
  return (
    <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
      <MaterialsProgress
        name={moduleName}
        type="Chapter"
        progress={progress}
        xpEarned={xpEarned}
        onBack={onBack}
      />

      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <ChapterCard
            isLearner={isLearner}
            key={index}
            title={chapter.title}
            description={chapter.description}
            status={chapter.status}
            lessonNumber={chapter.lessonNumber}
            progress={chapter.progress}
            ids={{
              courseId: chapter?.ids?.courseId,
              moduleId: chapter?.ids?.moduleId,
              chapterId: chapter?.ids?.chapterId,
            }}
          />
        ))}
      </div>
    </div>
  );
}
