import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { AppDataSource } from "../config/dataSource";
import { Chapter } from "../entity/course/chapter";
import { Course } from "../entity/course/course";
import { CourseEnrollment } from "../entity/course/courseEnrollment";
import { Lesson } from "../entity/course/lesson";
import { LessonContentLink } from "../entity/course/lessonContentLink";
import { Module } from "../entity/course/module";
import { Quiz } from "../entity/course/quiz";
import { QuizOption } from "../entity/course/quizOption";
import { LearnerActivity } from "../entity/learningProgress/learnerActivity";
import { LearnerProgress } from "../entity/learningProgress/learnerProgress";
import { LearnerStatistics } from "../entity/learningProgress/learnerStatistics";
import { generateCompleteDataset } from "./generateSeedData";
import { User } from "../entity/account/user";

// Load environment variables
config();

interface SeedData {
  courses: any[];
  modules: any[];
  chapters: any[];
  lessons: any[];
  lessonContentLinks: any[];
  quizzes: any[];
  quizOptions: any[];
  courseEnrollments?: any[];
  learnerProgress?: any[];
  learnerActivity?: any[];
  learnerStatistics?: any[];
}

async function loadSeedData(): Promise<SeedData> {
  const dataPath = path.join(__dirname, "data/complete-seed-data.json");
  const rawData = fs.readFileSync(dataPath, "utf8");
  return JSON.parse(rawData);
}

async function clearDatabase(closeConnection: boolean = false) {
  console.log("🗑️  Clearing existing data...");

  // Initialize database connection if not already initialized
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("✅ Database connection established");
  }

  // For PostgreSQL, we need to disable foreign key checks and truncate with CASCADE
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    // Truncate learner tables first (they reference other tables)
    await queryRunner.query(
      'TRUNCATE TABLE "learner_activity" RESTART IDENTITY CASCADE',
    );
    await queryRunner.query(
      'TRUNCATE TABLE "learner_progress" RESTART IDENTITY CASCADE',
    );
    await queryRunner.query(
      'TRUNCATE TABLE "learner_statistics" RESTART IDENTITY CASCADE',
    );
    await queryRunner.query(
      'TRUNCATE TABLE "course_enrollment" RESTART IDENTITY CASCADE',
    );

    // Then truncate course-related tables
    await queryRunner.query(
      'TRUNCATE TABLE "quiz_option" RESTART IDENTITY CASCADE',
    );
    await queryRunner.query('TRUNCATE TABLE "quiz" RESTART IDENTITY CASCADE');
    await queryRunner.query(
      'TRUNCATE TABLE "lesson_content_link" RESTART IDENTITY CASCADE',
    );
    await queryRunner.query('TRUNCATE TABLE "lesson" RESTART IDENTITY CASCADE');
    await queryRunner.query(
      'TRUNCATE TABLE "chapter" RESTART IDENTITY CASCADE',
    );
    await queryRunner.query('TRUNCATE TABLE "module" RESTART IDENTITY CASCADE');
    await queryRunner.query('TRUNCATE TABLE "course" RESTART IDENTITY CASCADE');

    // NOTE: User table is NOT truncated - it remains intact

    console.log("✅ Database cleared successfully (User table preserved)");
  } finally {
    await queryRunner.release();

    // Only close database connection if explicitly requested
    if (closeConnection && AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("✅ Database connection closed");
    }
  }
}

async function seedCourses(courses: any[]) {
  console.log("📚 Seeding courses...");

  for (const courseData of courses) {
    const course = AppDataSource.manager.create(Course, {
      id: courseData.id,
      name: courseData.name,
      description: courseData.description,
      imageUrl: courseData.imageUrl,
      lemonSqueezyProductId: courseData.lemonSqueezyProductId,
      enrollLink: courseData.enrollLink,
      status: courseData.status,
      validityYear: courseData.validityYear,
      version: courseData.version,
      price: courseData.price,
      position: courseData.position,
    });

    await AppDataSource.manager.save(course);
  }

  console.log(`✅ Seeded ${courses.length} courses`);
}

async function seedModules(modules: any[]) {
  console.log("📖 Seeding modules...");

  for (const moduleData of modules) {
    const module = AppDataSource.manager.create(Module, {
      id: moduleData.id,
      courseId: moduleData.courseId,
      name: moduleData.name,
      description: moduleData.description,
      iconName: moduleData.iconName,
      status: moduleData.status,
      position: moduleData.position,
    });

    await AppDataSource.manager.save(module);
  }

  console.log(`✅ Seeded ${modules.length} modules`);
}

async function seedChapters(chapters: any[]) {
  console.log("📑 Seeding chapters...");

  for (const chapterData of chapters) {
    const chapter = AppDataSource.manager.create(Chapter, {
      id: chapterData.id,
      moduleId: chapterData.moduleId,
      courseId: chapterData.courseId,
      name: chapterData.name,
      description: chapterData.description,
      status: chapterData.status,
      position: chapterData.position,
    });

    await AppDataSource.manager.save(chapter);
  }

  console.log(`✅ Seeded ${chapters.length} chapters`);
}

async function seedLessons(lessons: any[]) {
  console.log("📝 Seeding lessons...");

  for (const lessonData of lessons) {
    const lesson = AppDataSource.manager.create(Lesson, {
      id: lessonData.id,
      courseId: lessonData.courseId,
      moduleId: lessonData.moduleId,
      chapterId: lessonData.chapterId,
      name: lessonData.name,
      description: lessonData.description,
      status: lessonData.status,
      position: lessonData.position,
      xpPoints: lessonData.xpPoints,
      type: lessonData.type,
    });

    await AppDataSource.manager.save(lesson);
  }

  console.log(`✅ Seeded ${lessons.length} lessons`);
}

async function seedLessonContentLinks(contentLinks: any[]) {
  console.log("🔗 Seeding lesson content links...");

  for (const linkData of contentLinks) {
    const contentLink = AppDataSource.manager.create(LessonContentLink, {
      id: linkData.id,
      lessonId: linkData.lessonId,
      url: linkData.url,
      title: linkData.title,
      linkType: linkData.linkType,
      position: linkData.position,
    });

    await AppDataSource.manager.save(contentLink);
  }

  console.log(`✅ Seeded ${contentLinks.length} lesson content links`);
}

async function seedQuizzes(quizzes: any[]) {
  console.log("❓ Seeding quizzes...");

  for (const quizData of quizzes) {
    const quiz = AppDataSource.manager.create(Quiz, {
      id: quizData.id,
      courseId: quizData.courseId,
      lessonId: quizData.lessonId,
      question: quizData.question,
      explanation: quizData.explanation,
      position: quizData.position,
    });

    await AppDataSource.manager.save(quiz);
  }

  console.log(`✅ Seeded ${quizzes.length} quizzes`);
}

async function seedQuizOptions(quizOptions: any[]) {
  console.log("✅ Seeding quiz options...");

  for (const optionData of quizOptions) {
    const option = AppDataSource.manager.create(QuizOption, {
      id: optionData.id,
      quizId: optionData.quizId,
      text: optionData.text,
      isCorrect: optionData.isCorrect,
      position: optionData.position,
    });

    await AppDataSource.manager.save(option);
  }

  console.log(`✅ Seeded ${quizOptions.length} quiz options`);
}

async function seedCourseEnrollments(enrollments: any[]) {
  console.log("🎓 Seeding course enrollments...");

  for (const enrollmentData of enrollments) {
    const enrollment = AppDataSource.manager.create(CourseEnrollment, {
      id: enrollmentData.id,
      userId: enrollmentData.userId,
      courseId: enrollmentData.courseId,
      status: enrollmentData.status,
      expiresAt: enrollmentData.expiresAt,
      invoiceLink: enrollmentData.invoiceLink,
      lemonSqueezyOrderId: enrollmentData.lemonSqueezyOrderId,
      lemonSqueezyCustomerId: enrollmentData.lemonSqueezyCustomerId,
      totalPrice: enrollmentData.totalPrice,
      paidUserName: enrollmentData.paidUserName,
      paidUserEmail: enrollmentData.paidUserEmail,
      createdAt: enrollmentData.createdAt,
      updatedAt: enrollmentData.updatedAt,
    });

    await AppDataSource.manager.save(enrollment);
  }

  console.log(`✅ Seeded ${enrollments.length} course enrollments`);
}

async function seedLearnerProgress(progressEntries: any[]) {
  console.log("📈 Seeding learner progress...");

  for (const progressData of progressEntries) {
    const progress = AppDataSource.manager.create(LearnerProgress, {
      id: progressData.id,
      userId: progressData.userId,
      courseId: progressData.courseId,
      moduleId: progressData.moduleId,
      chapterId: progressData.chapterId,
      lessonId: progressData.lessonId,
      createdAt: progressData.createdAt,
      updatedAt: progressData.updatedAt,
    });

    await AppDataSource.manager.save(progress);
  }

  console.log(`✅ Seeded ${progressEntries.length} learner progress entries`);
}

async function seedLearnerActivity(activities: any[]) {
  console.log("🏃 Seeding learner activities...");

  for (const activityData of activities) {
    const activity = AppDataSource.manager.create(LearnerActivity, {
      id: activityData.id,
      userId: activityData.userId,
      courseId: activityData.courseId,
      moduleId: activityData.moduleId,
      chapterId: activityData.chapterId,
      lessonId: activityData.lessonId,
      xpEarned: activityData.xpEarned,
      date: activityData.date,
      createdAt: activityData.createdAt,
      updatedAt: activityData.updatedAt,
    });

    await AppDataSource.manager.save(activity);
  }

  console.log(`✅ Seeded ${activities.length} learner activities`);
}

async function seedLearnerStatistics(statistics: any[]) {
  console.log("📊 Seeding learner statistics...");

  for (const statsData of statistics) {
    const stats = AppDataSource.manager.create(LearnerStatistics, {
      id: statsData.id,
      userId: statsData.userId,
      currentStreak: statsData.currentStreak,
      longestStreak: statsData.longestStreak,
      totalXp: statsData.totalXp,
      createdAt: statsData.createdAt,
      updatedAt: statsData.updatedAt,
    });

    await AppDataSource.manager.save(stats);
  }

  console.log(`✅ Seeded ${statistics.length} learner statistics`);
}

async function seed() {
  try {
    console.log("🚀 Starting database seeding...");

    // Initialize database connection
    await AppDataSource.initialize();
    console.log("✅ Database connection established");

    // Read existing users from database (don't modify them!)
    console.log("👥 Reading existing users...");
    const users = await AppDataSource.manager.find(User, {
      select: ["id", "role"],
    });
    console.log(`✅ Found ${users.length} existing users`);

    const learners = users.filter((user) => user.role === "learner");
    console.log(`📚 Found ${learners.length} learners to enroll in courses`);

    // Check if we need to generate new seed data with learner data
    const dataPath = path.join(__dirname, "data/complete-seed-data.json");
    let seedData: SeedData;

    if (!fs.existsSync(dataPath) || learners.length > 0) {
      console.log("🔄 Generating fresh seed data with learner enrollments...");
      // Generate new seed data including learner data
      seedData = await generateCompleteDataset(
        users.map((u) => ({ id: u.id, role: u.role })),
      );
    } else {
      console.log("📁 Loading existing seed data...");
      seedData = await loadSeedData();
    }

    console.log("✅ Seed data ready");

    // Clear existing data (preserves User table)
    await clearDatabase();

    // Seed data in the correct order (respecting foreign key constraints)
    console.log("🌱 Seeding course data...");
    await seedCourses(seedData.courses);
    await seedModules(seedData.modules);
    await seedChapters(seedData.chapters);
    await seedLessons(seedData.lessons);
    await seedLessonContentLinks(seedData.lessonContentLinks);
    await seedQuizzes(seedData.quizzes);
    await seedQuizOptions(seedData.quizOptions);

    // Seed learner data if available
    if (seedData.courseEnrollments && seedData.courseEnrollments.length > 0) {
      console.log("� Seeding learner data...");
      await seedCourseEnrollments(seedData.courseEnrollments);

      if (seedData.learnerProgress) {
        await seedLearnerProgress(seedData.learnerProgress);
      }

      if (seedData.learnerActivity) {
        await seedLearnerActivity(seedData.learnerActivity);
      }

      if (seedData.learnerStatistics) {
        await seedLearnerStatistics(seedData.learnerStatistics);
      }
    }

    console.log("�🎉 Database seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - ${seedData.courses.length} courses`);
    console.log(`   - ${seedData.modules.length} modules`);
    console.log(`   - ${seedData.chapters.length} chapters`);
    console.log(`   - ${seedData.lessons.length} lessons`);
    console.log(`   - ${seedData.lessonContentLinks.length} content links`);
    console.log(`   - ${seedData.quizzes.length} quizzes`);
    console.log(`   - ${seedData.quizOptions.length} quiz options`);

    if (seedData.courseEnrollments) {
      console.log(
        `   - ${seedData.courseEnrollments.length} course enrollments`,
      );
      console.log(
        `   - ${seedData.learnerProgress?.length || 0} learner progress entries`,
      );
      console.log(
        `   - ${seedData.learnerActivity?.length || 0} learner activities`,
      );
      console.log(
        `   - ${seedData.learnerStatistics?.length || 0} learner statistics`,
      );
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("✅ Database connection closed");
    }
  }
}

// Run the seeding script if this file is executed directly
if (require.main === module) {
  seed().catch((error) => {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  });
}

export { clearDatabase, seed };
