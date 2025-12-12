import { CheckIcon } from "lucide-react";
import React from "react";

export const Stepper = ({
  total,
  position,
}: {
  total: number;
  position: number;
}) => {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <div>
      <div className="flex flex-col items-center">
        {steps.map((step, index) => {
          const isCompleted = position > step;
          const isActive = position === step;
          const isLastStep = index === steps.length - 1;

          return (
            <React.Fragment key={step}>
              <div
                className={`
                  flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full
                  transition-all duration-300 flex-shrink-0
                  ${isCompleted ? "bg-emerald-300 text-emerald-900" : ""}
                  ${
                    isActive
                      ? "bg-emerald-900 dark:bg-gray-800 border-2 sm:border-4 border-emerald-300"
                      : ""
                  }
                  ${
                    !isCompleted && !isActive
                      ? "bg-gray-300 dark:bg-gray-600"
                      : ""
                  }
                `}
              >
                {isCompleted && (
                  <CheckIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                )}
              </div>

              {!isLastStep && (
                <div
                  className={`
                    w-1 h-8 transition-all duration-500 my-1
                    ${
                      isCompleted
                        ? "bg-emerald-300"
                        : "bg-gray-300 dark:bg-gray-600"
                    }
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
