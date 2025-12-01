import Button from "@/components/common/button";
import Loading from "@/components/common/loading";
import {
  Book,
  BookA,
  BookOpen,
  FileQuestionIcon,
  LockIcon,
  PlayIcon,
} from "lucide-react";
import React from "react";

export interface ICourseHeaderData {
  // category?: string;
  title?: string;
  modules?: string;
  chapters?: string;
  lessons?: string;
  quizzes?: string;
  description?: string;
  onEnroll?: () => void;
  onEnrollLoading?: boolean;
  onPreview?: () => void;
  imageUrl?: string;
  isSignedIn?: boolean;
  isCoursePurchased?: boolean;
}

export const CourseHeader: React.FC<{ data?: ICourseHeaderData }> = ({
  data: {
    // category,
    title,
    modules,
    chapters,
    lessons,
    quizzes,
    description,
    onEnroll,
    onPreview,
    imageUrl,
    isSignedIn = false,
    onEnrollLoading = false,
    isCoursePurchased = false,
  } = courseHeaderData,
}) => {
  return (
    <div className="bg-white dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-full md:w-1/2 order-2 md:order-1">
          {/* <div className="inline-block px-3 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-sm font-medium mb-4 border border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">
            {category}
          </div> */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-500">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-6">
            {modules ? (
              <div className="flex items-center">
                <BookA className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {modules}
                </span>
              </div>
            ) : null}

            {chapters ? (
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {chapters}
                </span>
              </div>
            ) : null}

            {lessons ? (
              <div className="flex items-center">
                <Book className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {lessons}
                </span>
              </div>
            ) : null}

            {quizzes ? (
              <div className="flex items-center">
                <FileQuestionIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">
                  {quizzes}
                </span>
              </div>
            ) : null}
          </div>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            {description}
          </p>

          <div className="flex flex-wrap gap-4">
            {!isCoursePurchased ? (
              <Button
                disabled={onEnrollLoading}
                icon={
                  onEnrollLoading ? <Loading variant="spinner" noGap /> : null
                }
                onClick={onEnroll}
                size="lg"
              >
                Enroll Now
              </Button>
            ) : null}

            {isCoursePurchased ? (
              <Button
                icon={<PlayIcon className="h-4 w-4" />}
                onClick={onPreview}
                variant="success"
              >
                Continue Learning
              </Button>
            ) : null}
          </div>

          {!isSignedIn ? (
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Please sign in with your GitHub account to enroll in a course
            </p>
          ) : null}
        </div>

        <div className="w-full md:w-1/2 order-1 md:order-2 relative">
          <div className="aspect-video rounded-xl overflow-hidden  border border-gray-200 dark:border-gray-700 relative">
            <img
              src={imageUrl}
              alt="Course Banner"
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-300/40 to-purple-300/20 dark:from-indigo-900/40 dark:to-purple-900/20"></div>
            <div className="absolute bottom-4 right-4 bg-white/60 backdrop-blur-sm p-3 rounded-full dark:bg-black/60">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 cursor-pointer transform hover:scale-110 transition-transform modules-300">
                <LockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const courseHeaderData: ICourseHeaderData = {
  // category: "Programming",
  title: "Advanced JavaScript Programming",
  modules: "12 Weeks",
  chapters: "36 Chapters",
  lessons: "5,234 Students",
  description:
    "Master modern JavaScript with this comprehensive course. Learn advanced concepts, best practices, and real-world applications through hands-on exercises and projects.",
  imageUrl:
    "https://i.ytimg.com/vi/6tcOLa497Rc/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBSniBiiaGGAE83LwKQ8Q7EuGsPHg",
  onEnroll: () => alert("Enrolling"),
  onPreview: () => alert("Preview Course"),
};
