import Button from "@/components/common/button";
import MarkdownViewer from "@/components/common/markdown/markdownViewer";
import {
  ELessonContentLinkType,
  type ICurrentLesson,
} from "@packages/definitions";
import { ArrowLeft } from "lucide-react";
import { LessonFooter } from "./lessonFooter";
import { Stepper } from "./lessonStepper";
import LessonVideos from "./lessonVideos";
import { ProgressBar } from "./progressBar";
import { QuizSection } from "./quizSelection";

export default function MainLesson({
  isFooter,
  data,
  onComplete,
  isLoading,
  onPrevious,
  onBack,
}: {
  isFooter?: boolean;
  data?: ICurrentLesson;
  isLoading?: boolean;
  isCurrent?: boolean;
  onComplete: () => void;
  onPrevious?: () => void;
  onBack?: () => void;
}) {
  const progress = data?.progress?.progressPercentage || 0;

  // Helper functions for cleaner rendering logic
  const getFirstContentLink = () => data?.lesson?.contentLinks?.[0];

  const isVideoContent = () => {
    if (hasMarkdownContent()) return false;
    if (hasQuizzes()) return false;

    const link = getFirstContentLink();
    if (!link?.url) return false;

    const linkType = link.linkType?.toLowerCase();
    return (
      linkType === ELessonContentLinkType.VIDEO ||
      linkType === "video" ||
      !linkType
    );
  };

  const hasMarkdownContent = () => {
    const link = getFirstContentLink();
    return !!link?.content;
  };

  const hasQuizzes = () => !!data?.lesson?.quizzes?.length;

  return (
    <div className="bg-white dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 rounded-2xl max-w-5xl mx-auto p-6 border border-gray-200 dark:border-gray-700">
      <div className="fixed flex space-x-4 items-center top-1/2 -translate-y-1/2 right-8 z-50">
        {progress !== undefined && progress >= 0 ? (
          <ProgressBar
            isCircular
            progress={data?.progress?.progressPercentage || 0}
            size={70}
          />
        ) : null}

        {data?.progress ? (
          <div className="w-1/2">
            <Stepper
              total={data?.progress?.totalLessons}
              position={data?.lesson.position}
            />
          </div>
        ) : null}
      </div>

      {isFooter ? (
        <LessonFooter
          isLoading={isLoading}
          onComplete={onComplete}
          onPrevious={onPrevious}
          nextLessonLabel={
            !data?.navigation?.nextLesson && data?.lesson?.isCompleted
              ? "All Lessons"
              : data?.lesson?.isCompleted
              ? "Next Lesson"
              : "Submit Lesson"
          }
        />
      ) : null}

      <div>
        <div className="flex items-center my-4">
          <div className="mr-4">
            <Button variant="secondary" size="sm" onClick={onBack}>
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </Button>
          </div>

          <div className="flex w-full justify-between items-center">
            <div className="w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {(data?.lesson as { name?: string })?.name || ""}
              </h2>
              <p className="text-gray-700 dark:text-gray-400">
                {(data?.lesson as { chapterName?: string })?.chapterName || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow mt-8">
        <div className="">
          {/* Video Content */}
          {isVideoContent() && (
            <div className="mb-6">
              <LessonVideos url={getFirstContentLink()!.url} />
            </div>
          )}

          {/* Markdown Content */}
          {hasMarkdownContent() && (
            <div className="w-full mb-6">
              <MarkdownViewer
                markdownContent={getFirstContentLink()!.content!}
              />
            </div>
          )}

          {/* Quiz Content */}
          {hasQuizzes() && (
            <div className="w-full">
              {data!.lesson.quizzes!.map((quiz, index) => (
                <QuizSection
                  key={index}
                  question={quiz?.question}
                  options={quiz?.options?.map((option) => option?.text)}
                  correctAnswer={
                    quiz?.options?.find((option) => option.isCorrect)?.text ||
                    ""
                  }
                  onAnswerSubmit={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
