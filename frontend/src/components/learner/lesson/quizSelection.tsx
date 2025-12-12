import { Check, CheckCircle, X, XCircle } from "lucide-react";
import { useState } from "react";

interface QuizSectionProps {
  question: string;
  options: string[];
  correctAnswer: string;
  onAnswerSubmit: (isCorrect: boolean) => void;
  initialSelectedAnswer?: string | null;
  initialIsAnswerChecked?: boolean;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  question,
  options,
  correctAnswer,
  onAnswerSubmit,
  initialSelectedAnswer = null,
  initialIsAnswerChecked = false,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    initialSelectedAnswer
  );
  const [isAnswerChecked, setIsAnswerChecked] = useState(
    initialIsAnswerChecked
  );
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = () => {
    if (!selectedAnswer) return;

    setIsAnswerChecked(true);
    const correct = selectedAnswer === correctAnswer;
    setIsCorrect(correct);
    onAnswerSubmit(correct);
  };

  const handleSelectAnswer = (answer: string) => {
    if (isAnswerChecked) return;
    setSelectedAnswer(answer);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {question}
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima,
          sapiente?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((answer) => (
          <button
            key={answer}
            onClick={() => handleSelectAnswer(answer)}
            disabled={isAnswerChecked}
            className={`p-6 rounded-xl text-left transition-all duration-200 ${
              isAnswerChecked
                ? answer === correctAnswer
                  ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-600"
                  : answer === selectedAnswer
                  ? "bg-red-100 dark:bg-red-900/30 border-2 border-red-600"
                  : "bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                : selectedAnswer === answer
                ? "bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-500"
                : "bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500"
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                className={`text-lg font-medium ${
                  isAnswerChecked
                    ? answer === correctAnswer
                      ? "text-green-600 dark:text-green-400"
                      : answer === selectedAnswer
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-400"
                    : selectedAnswer === answer
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {answer}
              </span>
              {isAnswerChecked && answer === correctAnswer && (
                <Check className="h-5 w-5 text-green-500" />
              )}
              {isAnswerChecked &&
                answer === selectedAnswer &&
                answer !== correctAnswer && (
                  <X className="h-5 w-5 text-red-500" />
                )}
            </div>
          </button>
        ))}
      </div>

      {!isAnswerChecked ? (
        <div className="mt-8 flex justify-between items-center">
          <button className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-300 font-medium border border-gray-200 dark:border-gray-700">
            <X className="h-4 w-4 mr-2 inline" />
            Skip
          </button>
          <button
            onClick={checkAnswer}
            disabled={!selectedAnswer}
            className={`px-8 py-3 rounded-xl transition-colors duration-300 font-medium ${
              selectedAnswer
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white hover:from-indigo-600 hover:to-purple-600 dark:hover:from-indigo-700 dark:hover:to-purple-700"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            Check Answer
          </button>
        </div>
      ) : (
        <div className="mt-8">
          <div
            className={`p-4 ${
              isCorrect
                ? "bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700"
                : "bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700"
            } rounded-lg`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {isCorrect ? (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`font-medium ${
                    isCorrect
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isCorrect ? "Correct!" : "Incorrect"}
                </p>
                <p
                  className={`mt-1 ${
                    isCorrect
                      ? "text-green-700 dark:text-green-300"
                      : "text-red-700 dark:text-red-300"
                  }`}
                >
                  In JavaScript, Arrays are actually objects, so typeof []
                  returns 'object'.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
