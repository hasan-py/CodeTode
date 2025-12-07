import Loading from "@/components/common/loading";
import ActiveCourses from "@/components/learner/course/activeCourses";
import LearnerInfoHeader from "@/components/learner/course/learnerInfoHeader";
import { useAuthController } from "@/hooks/controller/account/useAuthController";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/learner/_layout/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuthController();
  const isLoading = false;

  if (isLoading) {
    return <Loading fullscreen />;
  }

  return (
    <div className="max-w-3/4 mx-auto space-y-4">
      <LearnerInfoHeader
        user={user}
        isCoursePurchaseBanner={user?.courseEnrollments?.length === 0}
      />

      <ActiveCourses courses={dummyData} />
    </div>
  );
}

const dummyData: any = [
  {
    courseId: 5,
    course: {
      id: 5,
      name: "Machine Learning with TensorFlow",
      description:
        "Deep dive into machine learning algorithms and neural networks using TensorFlow",
      imageUrl: "https://placehold.co/24x24",
      enrollLink: "https://learn.example.com/enroll/ml-tensorflow",
      price: "399.99",
    },
    progress: {
      totalLessons: 81,
      completedLessons: 49,
      progressPercentage: 60,
      totalXpEarned: 614,
    },
    learnerProgress: {
      moduleId: 19,
      chapterId: 94,
      lessonId: 375,
    },
  },
  {
    courseId: 4,
    course: {
      id: 4,
      name: "DevOps and Cloud Computing",
      description:
        "Master Docker, Kubernetes, AWS, and CI/CD pipelines for modern software deployment",
      imageUrl: "https://placehold.co/24x24",
      enrollLink: "https://learn.example.com/enroll/devops-cloud",
      price: "349.99",
    },
    progress: {
      totalLessons: 85,
      completedLessons: 75,
      progressPercentage: 88,
      totalXpEarned: 871,
    },
    learnerProgress: {
      moduleId: 16,
      chapterId: 78,
      lessonId: 316,
    },
  },
  {
    courseId: 3,
    course: {
      id: 3,
      name: "Mobile App Development with React Native",
      description:
        "Build cross-platform mobile applications using React Native and Expo",
      imageUrl: "https://placehold.co/24x24",
      enrollLink: "https://learn.example.com/enroll/react-native",
      price: "199.99",
    },
    progress: {
      totalLessons: 82,
      completedLessons: 69,
      progressPercentage: 84,
      totalXpEarned: 825,
    },
    learnerProgress: {
      moduleId: 12,
      chapterId: 58,
      lessonId: 228,
    },
  },
  {
    courseId: 8,
    course: {
      id: 8,
      name: "Devops and cloud computing",
      description:
        "This Chrome extension allows you to easily select any text from any webpage and instantly use GPT, Gemini, and Grok APIs to perform a variety of tasks with just a few clicks",
      imageUrl:
        "https://cdn.lemonsqueezy.com/media/146877/f0ab8ef3-65b1-4d9b-81ae-0ffa210df803.jpg?fit=contain&format=auto&height=1000&ixlib=php-3.3.1&width=1000",
      enrollLink:
        "https://hasan-py.lemonsqueezy.com/checkout/buy/45bc3af6-25d3-4229-b297-ebb2685b4509",
      price: "75.00",
    },
    progress: {
      totalLessons: 0,
      completedLessons: 0,
      progressPercentage: 0,
      totalXpEarned: 0,
    },
    learnerProgress: null,
  },
];
