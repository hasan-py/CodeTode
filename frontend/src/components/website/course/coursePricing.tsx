import Button from "@/components/common/button";
import Loading from "@/components/common/loading";
import { Award, MessageSquare, Smartphone } from "lucide-react";

export interface ICoursePricingData {
  price?: string;
  pricePeriod?: string;
  onEnroll?: () => void;
  loading?: boolean;
  onContinueLearning?: () => void;
}

export const CoursePricing: React.FC<{ data?: ICoursePricingData }> = ({
  data: {
    price,
    pricePeriod,
    onEnroll,
    loading,
    onContinueLearning,
  } = coursePricingData,
}) => {
  return (
    <div className="bg-white dark:bg-gradient-to-b dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
      <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600"></div>
      <div className="p-8">
        <div className="text-center mb-8">
          <span className="text-3xl dark:text-5xl font-bold text-gray-900 dark:text-white">
            {price}
          </span>
          <span className="text-gray-500 dark:text-gray-400 ml-2">
            {pricePeriod}
          </span>
        </div>

        {onEnroll ? (
          <Button
            disabled={loading}
            icon={loading ? <Loading variant="spinner" noGap /> : null}
            onClick={onEnroll}
            fullWidth
            size="lg"
          >
            Enroll Now
          </Button>
        ) : null}

        {onContinueLearning ? (
          <Button
            disabled={loading}
            onClick={onContinueLearning}
            variant="secondary"
            size="lg"
          >
            Continue Learning
          </Button>
        ) : null}

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 my-6">
          30-day money-back guarantee
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
              <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              Certificate of Completion
            </span>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
              <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              Community Support
            </span>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-3">
              <Smartphone className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-gray-700 dark:text-gray-300">
              Mobile-Friendly Content
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const coursePricingData: ICoursePricingData = {
  price: "$149",
  pricePeriod: "one-time",
  onEnroll: () => alert("Enrolling"), // Note: Using alert() is generally discouraged in production React apps.
};
