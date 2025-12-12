import Button from "@/components/common/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const LessonFooter = ({
  onComplete,
  isLoading,
  onPrevious,
  previousLessonLabel = "Previous Lesson",
  nextLessonLabel = "Next Lesson",
}: {
  onComplete: () => void;
  onPrevious?: () => void;
  isLoading?: boolean;
  previousLessonLabel?: string;
  nextLessonLabel?: string;
}) => {
  return (
    <div className="fixed bottom-8 right-8 rounded-2xl p-4 z-50 bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {onPrevious ? (
          <Button
            variant="secondary"
            size="lg"
            disabled={isLoading}
            icon={<ArrowLeft className="h-5 w-5" />}
            onClick={onPrevious}
          >
            {previousLessonLabel}
          </Button>
        ) : null}

        {onComplete ? (
          <Button
            size="lg"
            iconPosition="right"
            icon={<ArrowRight className="h-5 w-5" />}
            onClick={onComplete}
            disabled={isLoading}
          >
            {nextLessonLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
