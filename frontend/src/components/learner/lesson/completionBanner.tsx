import Button from "@/components/common/button";
import { ArrowRight, Trophy } from "lucide-react";

export type CompletionBannerProps = {
  title: string;
  description: string;
  starsEarned: number;
  gotoCourseLabel?: string;
  nextChapterLabel?: string;
  onClickNextChapter?: () => void;
};

export default function CompletionBanner({
  title,
  description,
  starsEarned,
  nextChapterLabel = "Chapters",
  onClickNextChapter,
}: CompletionBannerProps) {
  return (
    <div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300/10 dark:bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-300/10 dark:bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="text-center relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full mb-6 border-4 border-emerald-300/50 dark:border-emerald-500/50">
          <Trophy className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-emerald-800 dark:text-white mb-4">
          {title}
        </h1>

        <p className="text-xl text-emerald-700 dark:text-emerald-300 mb-8">
          {description}
        </p>

        <div className="flex justify-center items-center space-x-4 mb-8">
          <h3>Total Xp Earned</h3>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500 dark:text-yellow-400 inline mr-2" />
            <span className="text-lg font-semibold text-yellow-500 dark:text-yellow-400">
              {starsEarned}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            iconPosition="right"
            icon={<ArrowRight className="h-5 w-5" />}
            onClick={onClickNextChapter}
          >
            {nextChapterLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
