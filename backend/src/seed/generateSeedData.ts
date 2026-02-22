import * as fs from "fs";
import * as path from "path";

interface Course {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  lemonSqueezyProductId: string;
  enrollLink: string;
  status: string;
  validityYear: number;
  version: string;
  price: number;
  position: number;
}

interface Module {
  id: number;
  courseId: number;
  name: string;
  description: string;
  iconName: string;
  status: string;
  position: number;
}

interface Chapter {
  id: number;
  moduleId: number;
  courseId: number;
  name: string;
  description: string;
  status: string;
  position: number;
}

interface Lesson {
  id: number;
  courseId: number;
  moduleId: number;
  chapterId: number;
  name: string;
  description: string;
  status: string;
  position: number;
  xpPoints: number;
  type: "theory" | "quiz" | "coding";
}

interface LessonContentLink {
  id: number;
  lessonId: number;
  url: string;
  title: string;
  linkType: "markdown" | "video" | "image";
  position: number;
}

interface Quiz {
  id: number;
  courseId: number;
  lessonId: number;
  question: string;
  explanation: string;
  position: number;
}

interface QuizOption {
  id: number;
  quizId: number;
  text: string;
  isCorrect: boolean;
  position: number;
}

// Learner-related interfaces
interface CourseEnrollment {
  id: number;
  userId: number;
  courseId: number;
  status: string;
  expiresAt: Date;
  invoiceLink: string;
  lemonSqueezyOrderId: number;
  lemonSqueezyCustomerId: number;
  totalPrice: number;
  paidUserName: string;
  paidUserEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

interface LearnerProgress {
  id: number;
  userId: number;
  courseId: number;
  moduleId: number | null;
  chapterId: number | null;
  lessonId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface LearnerActivity {
  id: number;
  userId: number;
  courseId: number;
  moduleId: number;
  chapterId: number;
  lessonId: number;
  xpEarned: number;
  date: string; // UTC date in 'YYYY-MM-DD' format
  createdAt: Date;
  updatedAt: Date;
}

interface LearnerStatistics {
  id: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  createdAt: Date;
  updatedAt: Date;
}

// Extended course data
const courses: Course[] = [
  {
    id: 1,
    name: "Full Stack JavaScript Development",
    description:
      "Master modern web development with JavaScript, Node.js, React, and MongoDB",
    imageUrl: "https://placehold.co/24x24",
    lemonSqueezyProductId: "prod_js_fullstack_001",
    enrollLink:
      "https://hasan-py.lemonsqueezy.com/checkout/buy/e725c0a0-abd1-4155-b157-c710c6d8d96b",
    status: "published",
    validityYear: 2,
    version: "1.0.0",
    price: 299.99,
    position: 1,
  },
  {
    id: 2,
    name: "Python for Data Science",
    description:
      "Learn Python programming for data analysis, machine learning, and visualization",
    imageUrl: "https://placehold.co/24x24",
    lemonSqueezyProductId: "prod_py_datascience_002",
    enrollLink:
      "https://hasan-py.lemonsqueezy.com/checkout/buy/e725c0a0-abd1-4155-b157-c710c6d8d96b",
    status: "published",
    validityYear: 1,
    version: "1.2.0",
    price: 249.99,
    position: 2,
  },
  {
    id: 3,
    name: "Mobile App Development with React Native",
    description:
      "Build cross-platform mobile applications using React Native and Expo",
    imageUrl: "https://placehold.co/24x24",
    lemonSqueezyProductId: "prod_rn_mobile_003",
    enrollLink:
      "https://hasan-py.lemonsqueezy.com/checkout/buy/e725c0a0-abd1-4155-b157-c710c6d8d96b",
    status: "published",
    validityYear: 1,
    version: "2.1.0",
    price: 199.99,
    position: 3,
  },
  {
    id: 4,
    name: "DevOps and Cloud Computing",
    description:
      "Master Docker, Kubernetes, AWS, and CI/CD pipelines for modern software deployment",
    imageUrl: "https://placehold.co/24x24",
    lemonSqueezyProductId: "prod_devops_cloud_004",
    enrollLink:
      "https://hasan-py.lemonsqueezy.com/checkout/buy/e725c0a0-abd1-4155-b157-c710c6d8d96b",
    status: "published",
    validityYear: 2,
    version: "1.5.0",
    price: 349.99,
    position: 4,
  },
  {
    id: 5,
    name: "Machine Learning with TensorFlow",
    description:
      "Deep dive into machine learning algorithms and neural networks using TensorFlow",
    imageUrl: "https://placehold.co/24x24",
    lemonSqueezyProductId: "prod_ml_tensorflow_005",
    enrollLink:
      "https://hasan-py.lemonsqueezy.com/checkout/buy/e725c0a0-abd1-4155-b157-c710c6d8d96b",
    status: "published",
    validityYear: 3,
    version: "1.0.0",
    price: 399.99,
    position: 5,
  },
];

// Generate comprehensive data
function generateFullDataset() {
  const modules: Module[] = [];
  const chapters: Chapter[] = [];
  const lessons: Lesson[] = [];
  const lessonContentLinks: LessonContentLink[] = [];
  const quizzes: Quiz[] = [];
  const quizOptions: QuizOption[] = [];

  let moduleId = 1;
  let chapterId = 1;
  let lessonId = 1;
  let contentLinkId = 1;
  let quizId = 1;
  let optionId = 1;

  // Course-specific module templates
  const courseModules = {
    1: [
      // JavaScript Full Stack
      {
        name: "Frontend Fundamentals",
        description: "HTML, CSS, and JavaScript basics",
        icon: "code-2",
      },
      {
        name: "React Development",
        description: "Modern UI with React",
        icon: "component",
      },
      {
        name: "Backend with Node.js",
        description: "Server-side development",
        icon: "server",
      },
      {
        name: "Database & Deployment",
        description: "MongoDB and deployment",
        icon: "database",
      },
    ],
    2: [
      // Python Data Science
      {
        name: "Python Basics",
        description: "Core Python programming",
        icon: "file-code",
      },
      {
        name: "Data Analysis",
        description: "Pandas and NumPy",
        icon: "bar-chart-3",
      },
      {
        name: "Machine Learning",
        description: "Scikit-learn algorithms",
        icon: "brain",
      },
      {
        name: "Data Visualization",
        description: "Charts and graphs",
        icon: "line-chart",
      },
    ],
    3: [
      // React Native
      {
        name: "React Native Setup",
        description: "Environment and basics",
        icon: "smartphone",
      },
      {
        name: "UI Components",
        description: "Mobile UI components",
        icon: "layout",
      },
      {
        name: "Navigation & State",
        description: "App navigation",
        icon: "navigation",
      },
      {
        name: "App Publishing",
        description: "Store deployment",
        icon: "upload",
      },
    ],
    4: [
      // DevOps
      {
        name: "Docker Fundamentals",
        description: "Containerization",
        icon: "package",
      },
      {
        name: "Kubernetes Orchestration",
        description: "Container orchestration",
        icon: "settings",
      },
      {
        name: "AWS Cloud Services",
        description: "Cloud infrastructure",
        icon: "cloud",
      },
      {
        name: "CI/CD Pipelines",
        description: "Automation",
        icon: "git-branch",
      },
    ],
    5: [
      // Machine Learning
      { name: "ML Fundamentals", description: "ML concepts", icon: "cpu" },
      {
        name: "TensorFlow Basics",
        description: "TensorFlow framework",
        icon: "layers",
      },
      {
        name: "Neural Networks",
        description: "Deep learning",
        icon: "network",
      },
      {
        name: "Model Deployment",
        description: "Production deployment",
        icon: "rocket",
      },
    ],
  };

  courses.forEach((course) => {
    const courseModuleTemplates =
      courseModules[course.id as keyof typeof courseModules];

    // Generate 4 modules per course
    for (let i = 0; i < 4; i++) {
      const moduleTemplate = courseModuleTemplates[i];
      const module: Module = {
        id: moduleId++,
        courseId: course.id,
        name: moduleTemplate.name,
        description: moduleTemplate.description,
        iconName: moduleTemplate.icon,
        status: "published",
        position: i + 1,
      };
      modules.push(module);

      // Generate 5 chapters per module
      for (let j = 0; j < 5; j++) {
        const chapter: Chapter = {
          id: chapterId++,
          moduleId: module.id,
          courseId: course.id,
          name: `${moduleTemplate.name} - Chapter ${j + 1}`,
          description: `Learn ${moduleTemplate.name.toLowerCase()} concepts and practices`,
          status: "published",
          position: j + 1,
        };
        chapters.push(chapter);

        // Generate 3-5 lessons per chapter (randomly)
        const lessonCount = Math.floor(Math.random() * 3) + 3; // 3-5 lessons
        for (let k = 0; k < lessonCount; k++) {
          const lessonTypes: ("theory" | "quiz" | "coding")[] = [
            "theory",
            "quiz",
            "coding",
          ];
          const randomType =
            lessonTypes[Math.floor(Math.random() * lessonTypes.length)];

          const lesson: Lesson = {
            id: lessonId,
            courseId: course.id,
            moduleId: module.id,
            chapterId: chapter.id,
            name: `${chapter.name} - Lesson ${k + 1}`,
            description: `Detailed lesson on ${chapter.name.toLowerCase()}`,
            status: "published",
            position: k + 1,
            xpPoints: Math.floor(Math.random() * 15) + 5, // 5-20 XP
            type: randomType,
          };
          lessons.push(lesson);

          // Add content links for theory and coding lessons
          if (randomType === "theory" || randomType === "coding") {
            const contentLink: LessonContentLink = {
              id: contentLinkId++,
              lessonId: lesson.id,
              url: `javascript-interview/module-01/chapter-01/01-introduction.md`,
              title: `${lesson.name} Guide`,
              linkType: "markdown",
              position: 1,
            };
            lessonContentLinks.push(contentLink);
          }

          // Add quiz for quiz lessons
          if (randomType === "quiz") {
            const quiz: Quiz = {
              id: quizId,
              courseId: course.id,
              lessonId: lesson.id,
              question: `What is the main concept of ${lesson.name}?`,
              explanation: `This question tests understanding of ${lesson.name.toLowerCase()}`,
              position: 1,
            };
            quizzes.push(quiz);

            // Add 4 quiz options
            const options = [
              { text: "Correct answer about the concept", isCorrect: true },
              { text: "Incorrect option A", isCorrect: false },
              { text: "Incorrect option B", isCorrect: false },
              { text: "Incorrect option C", isCorrect: false },
            ];

            options.forEach((optionData, index) => {
              const option: QuizOption = {
                id: optionId++,
                quizId: quiz.id,
                text: optionData.text,
                isCorrect: optionData.isCorrect,
                position: index + 1,
              };
              quizOptions.push(option);
            });

            quizId++;
          }

          lessonId++;
        }
      }
    }
  });

  return {
    courses,
    modules,
    chapters,
    lessons,
    lessonContentLinks,
    quizzes,
    quizOptions,
  };
}

// Generate learner data for existing users with role 'learner'
function generateLearnerData(
  users: { id: number; role: string }[],
  courses: Course[],
  lessons: Lesson[],
) {
  const courseEnrollments: CourseEnrollment[] = [];
  const learnerProgress: LearnerProgress[] = [];
  const learnerActivity: LearnerActivity[] = [];
  const learnerStatistics: LearnerStatistics[] = [];

  // Filter learners
  const learners = users.filter((user) => user.role === "learner");

  let enrollmentId = 1;
  let progressId = 1;
  let activityId = 1;
  let statisticsId = 1;

  // Helper function to get random int between min and max (inclusive)
  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Helper function to get random course lessons
  const getCourseModulesAndLessons = (courseId: number) => {
    return lessons.filter((lesson) => lesson.courseId === courseId);
  };

  learners.forEach((learner) => {
    // Enroll each learner in 2-3 courses randomly
    const numCourses = randomInt(2, 3);
    const shuffledCourses = [...courses].sort(() => Math.random() - 0.5);
    const enrolledCourses = shuffledCourses.slice(0, numCourses);

    let userTotalXp = 0;

    enrolledCourses.forEach((course) => {
      // Create course enrollment
      const expirationDate = new Date();
      expirationDate.setFullYear(
        expirationDate.getFullYear() + course.validityYear,
      );

      // Enrollment should be in the past (1-90 days ago)
      const enrollmentDaysAgo = randomInt(1, 90);
      const enrollmentDate = new Date(
        Date.now() - enrollmentDaysAgo * 24 * 60 * 60 * 1000,
      );

      const enrollment: CourseEnrollment = {
        id: enrollmentId++,
        userId: learner.id,
        courseId: course.id,
        status: "active",
        expiresAt: expirationDate,
        invoiceLink: `https://invoice.example.com/inv_${randomInt(1000, 9999)}`,
        lemonSqueezyOrderId: randomInt(100000, 999999),
        lemonSqueezyCustomerId: randomInt(10000, 99999),
        totalPrice: course.price,
        paidUserName: `User ${learner.id}`,
        paidUserEmail: `user${learner.id}@example.com`,
        createdAt: enrollmentDate,
        updatedAt: enrollmentDate,
      };
      courseEnrollments.push(enrollment);

      // Get lessons for this course
      const courseLessons = getCourseModulesAndLessons(course.id);

      // Sort lessons properly by module position, chapter position, then lesson position
      const sortedLessons = courseLessons.sort((a, b) => {
        // First sort by module position (we need to calculate this based on courseId and moduleId)
        if (a.moduleId !== b.moduleId) {
          return a.moduleId - b.moduleId; // Assuming moduleId is sequential
        }
        // Then by chapter position
        if (a.chapterId !== b.chapterId) {
          return a.chapterId - b.chapterId; // Assuming chapterId is sequential
        }
        // Finally by lesson position within chapter
        return a.position - b.position;
      });

      // Determine progress - learner has completed some percentage of the course
      const progressPercentage = Math.random(); // 0-100% completion
      const completedLessons = sortedLessons.slice(
        0,
        Math.floor(sortedLessons.length * progressPercentage),
      );

      // Track current progress position - should point to the NEXT lesson to be learned
      let currentModuleId = null;
      let currentChapterId = null;
      let currentLessonId = null;

      if (
        completedLessons.length > 0 &&
        completedLessons.length < sortedLessons.length
      ) {
        // Find the next lesson after the last completed one
        const nextLesson = sortedLessons[completedLessons.length]; // Next lesson in sorted order

        currentModuleId = nextLesson.moduleId;
        currentChapterId = nextLesson.chapterId;
        currentLessonId = nextLesson.id;
      } else if (completedLessons.length === 0) {
        // No lessons completed yet - set progress to the first lesson
        const firstLesson = sortedLessons[0];
        if (firstLesson) {
          currentModuleId = firstLesson.moduleId;
          currentChapterId = firstLesson.chapterId;
          currentLessonId = firstLesson.id;
        }
      } else {
        // Course completed - set progress to null
        currentModuleId = null;
        currentChapterId = null;
        currentLessonId = null;
      }

      // Create learner progress entry
      const progress: LearnerProgress = {
        id: progressId++,
        userId: learner.id,
        courseId: course.id,
        moduleId: currentModuleId,
        chapterId: currentChapterId,
        lessonId: currentLessonId,
        createdAt: enrollment.createdAt,
        updatedAt: new Date(),
      };
      learnerProgress.push(progress);

      // Create learner activities for completed lessons
      completedLessons.forEach((lesson, index) => {
        // Calculate activity date - should be in the past, spread over time since enrollment
        const daysSinceEnrollment = Math.floor(
          (Date.now() - enrollment.createdAt.getTime()) / (24 * 60 * 60 * 1000),
        );
        const maxDaysForActivity = Math.min(daysSinceEnrollment, 60); // Max 60 days or days since enrollment

        // Spread activities over time, with earlier lessons completed earlier
        const activityDayOffset = Math.floor(
          (index / completedLessons.length) * maxDaysForActivity,
        );
        const randomVariation = randomInt(0, 3); // Add some randomness (0-3 days)
        const finalDayOffset = Math.min(
          activityDayOffset + randomVariation,
          daysSinceEnrollment,
        );

        const activityDate = new Date(
          enrollment.createdAt.getTime() + finalDayOffset * 24 * 60 * 60 * 1000,
        );

        // Ensure activity date is not in the future
        const now = new Date();
        const finalActivityDate = activityDate > now ? now : activityDate;

        const activity: LearnerActivity = {
          id: activityId++,
          userId: learner.id,
          courseId: course.id,
          moduleId: lesson.moduleId,
          chapterId: lesson.chapterId,
          lessonId: lesson.id,
          xpEarned: lesson.xpPoints,
          date: finalActivityDate.toISOString().slice(0, 10), // UTC date in 'YYYY-MM-DD' format
          createdAt: finalActivityDate,
          updatedAt: finalActivityDate,
        };
        learnerActivity.push(activity);
        userTotalXp += lesson.xpPoints;
      });
    });

    // Create learner statistics
    const statistics: LearnerStatistics = {
      id: statisticsId++,
      userId: learner.id,
      currentStreak: randomInt(0, 15),
      longestStreak: randomInt(5, 30),
      totalXp: userTotalXp,
      createdAt: new Date(Date.now() - randomInt(30, 90) * 24 * 60 * 60 * 1000), // 30-90 days ago
      updatedAt: new Date(), // Updated recently to reflect current stats
    };
    learnerStatistics.push(statistics);
  });

  return {
    courseEnrollments,
    learnerProgress,
    learnerActivity,
    learnerStatistics,
  };
}

// Generate and save the complete dataset
function generateCompleteDataset(users: { id: number; role: string }[] = []) {
  console.log("🔄 Generating complete dataset...");

  const dataset = generateFullDataset();

  // Generate learner data if users are provided
  let learnerData: {
    courseEnrollments: CourseEnrollment[];
    learnerProgress: LearnerProgress[];
    learnerActivity: LearnerActivity[];
    learnerStatistics: LearnerStatistics[];
  } = {
    courseEnrollments: [],
    learnerProgress: [],
    learnerActivity: [],
    learnerStatistics: [],
  };

  if (users.length > 0) {
    console.log("👥 Generating learner data for existing users...");
    learnerData = generateLearnerData(users, dataset.courses, dataset.lessons);
  }

  const completeDataset = {
    ...dataset,
    ...learnerData,
  };

  console.log("📊 Generated data summary:");
  console.log(`   - ${dataset.courses.length} courses`);
  console.log(`   - ${dataset.modules.length} modules`);
  console.log(`   - ${dataset.chapters.length} chapters`);
  console.log(`   - ${dataset.lessons.length} lessons`);
  console.log(`   - ${dataset.lessonContentLinks.length} content links`);
  console.log(`   - ${dataset.quizzes.length} quizzes`);
  console.log(`   - ${dataset.quizOptions.length} quiz options`);

  if (users.length > 0) {
    console.log(
      `   - ${learnerData.courseEnrollments.length} course enrollments`,
    );
    console.log(
      `   - ${learnerData.learnerProgress.length} learner progress entries`,
    );
    console.log(
      `   - ${learnerData.learnerActivity.length} learner activities`,
    );
    console.log(
      `   - ${learnerData.learnerStatistics.length} learner statistics`,
    );
  }

  // Save to file
  const outputPath = path.join(__dirname, "data/complete-seed-data.json");

  // Ensure the data directory exists
  const dataDir = path.dirname(outputPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(completeDataset, null, 2));

  console.log(`✅ Complete dataset saved to: ${outputPath}`);
  return completeDataset;
}

// Run if executed directly
if (require.main === module) {
  generateCompleteDataset();
}

export { generateCompleteDataset, generateLearnerData };
