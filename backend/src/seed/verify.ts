import { EUserRole } from "@packages/definitions";
import { config } from "dotenv";
import { AppDataSource } from "../config/dataSource";
import { RefreshToken } from "../entity/account/refreshToken";
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
import { User } from "../entity/account/user";

// Load environment variables
config();

async function verifyAllTableCounts() {
  try {
    console.log("🔍 Verifying ALL database tables data counts...\n");

    // Define all entities that should have seeded data
    const entitiesToCheck = [
      {
        name: "User",
        entity: User,
        description: "Users (learners and admins)",
      },
      {
        name: "RefreshToken",
        entity: RefreshToken,
        description: "Authentication tokens",
        optional: true,
      },
      { name: "Course", entity: Course, description: "Courses" },
      { name: "Module", entity: Module, description: "Course modules" },
      { name: "Chapter", entity: Chapter, description: "Course chapters" },
      { name: "Lesson", entity: Lesson, description: "Course lessons" },
      { name: "Quiz", entity: Quiz, description: "Lesson quizzes" },
      { name: "QuizOption", entity: QuizOption, description: "Quiz options" },
      {
        name: "LessonContentLink",
        entity: LessonContentLink,
        description: "Lesson content links",
      },
      {
        name: "CourseEnrollment",
        entity: CourseEnrollment,
        description: "Course enrollments",
      },
      {
        name: "LearnerActivity",
        entity: LearnerActivity,
        description: "Learner activities",
      },
      {
        name: "LearnerProgress",
        entity: LearnerProgress,
        description: "Learner progress tracking",
      },
      {
        name: "LearnerStatistics",
        entity: LearnerStatistics,
        description: "Learner statistics",
      },
    ];

    let allTablesHaveData = true;
    let totalRecords = 0;

    console.log("📊 TABLE VERIFICATION SUMMARY");
    console.log("=====================================");

    for (const { name, entity, description, optional } of entitiesToCheck) {
      try {
        const count = await AppDataSource.manager.count(entity);
        totalRecords += count;

        const status = count > 0 ? "✅" : optional ? "⚠️ " : "❌";
        const statusText =
          count > 0 ? "HAS DATA" : optional ? "EMPTY (Optional)" : "EMPTY";

        console.log(
          `${status} ${name.padEnd(20)} | ${count.toString().padStart(4)} records | ${description}`,
        );

        if (count === 0 && !optional) {
          allTablesHaveData = false;
        }
      } catch (error) {
        console.log(`❌ ${name.padEnd(20)} | ERROR: ${error.message}`);
        allTablesHaveData = false;
      }
    }

    console.log("=====================================");
    console.log(`📈 TOTAL RECORDS ACROSS ALL TABLES: ${totalRecords}`);

    if (allTablesHaveData) {
      console.log("🎉 SUCCESS: All required tables have seeded data!");
    } else {
      console.log("❌ FAILURE: Some required tables are empty!");
    }

    return allTablesHaveData;
  } catch (error) {
    console.error("❌ Table verification failed:", error);
    throw error;
  }
}

async function verifySeededData() {
  try {
    console.log("\n🔍 Running basic data checks...");

    // Just do basic validation without verbose logging
    const users = await AppDataSource.manager.find(User);
    const learners = users.filter((user) => user.role === "learner");
    const courses = await AppDataSource.manager.find(Course);
    const enrollments = await AppDataSource.manager.find(CourseEnrollment);
    const activities = await AppDataSource.manager.find(LearnerActivity);

    console.log(
      `✅ Found ${users.length} users (${learners.length} learners), ${courses.length} courses, ${enrollments.length} enrollments, ${activities.length} activities`,
    );
  } catch (error) {
    console.error("❌ Basic data validation failed:", error);
    throw error;
  }
}

async function verifyProgressLogic() {
  try {
    console.log("\n🔍 Checking progress logic...");

    // Get all learners
    const learners = await AppDataSource.manager.find(User, {
      where: { role: EUserRole.LEARNER },
    });

    if (learners.length === 0) {
      console.log("❌ No learners found!");
      return;
    }

    let progressIssues = 0;

    for (const learner of learners) {
      // Get enrollments for this learner
      const enrollments = await AppDataSource.manager.find(CourseEnrollment, {
        where: { userId: learner.id },
      });

      for (const enrollment of enrollments) {
        // Get completed activities for this course
        const activities = await AppDataSource.manager.find(LearnerActivity, {
          where: {
            userId: learner.id,
            courseId: enrollment.courseId,
          },
        });

        // Get current progress for this course
        const progress = await AppDataSource.manager.findOne(LearnerProgress, {
          where: {
            userId: learner.id,
            courseId: enrollment.courseId,
          },
        });

        // Basic validation - just count issues, don't log details
        if (activities.length > 0 && (!progress || !progress.lessonId)) {
          progressIssues++;
        }
      }
    }

    if (progressIssues === 0) {
      console.log("✅ Progress logic validation passed");
    } else {
      console.log(
        `⚠️  Found ${progressIssues} potential progress logic issues`,
      );
    }
  } catch (error) {
    console.error("❌ Progress logic validation failed:", error);
    throw error;
  }
}

async function verifyAll() {
  try {
    console.log("🚀 Starting seed data verification...\n");

    // Initialize database connection
    await AppDataSource.initialize();
    console.log("✅ Database connection established\n");

    // Step 1: Verify all tables have data (main verification)
    const allTablesHaveData = await verifyAllTableCounts();

    if (!allTablesHaveData) {
      console.log(
        "\n❌ CRITICAL: Some required tables are empty! Seeding may have failed.",
      );
      console.log("💡 Consider running: pnpm run seed:clean && pnpm run seed");
      return;
    }

    // Step 2: Quick data validation
    await verifySeededData();

    // Step 3: Quick progress logic check
    await verifyProgressLogic();

    console.log("\n🎉 Seed data verification completed successfully!");
  } catch (error) {
    console.error("❌ Verification failed:", error);
  } finally {
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log("\n✅ Database connection closed");
    }
  }
}

// Run if executed directly
if (require.main === module) {
  verifyAll();
}

export {
  verifyAll,
  verifyAllTableCounts,
  verifyProgressLogic,
  verifySeededData,
};
