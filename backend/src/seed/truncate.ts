import { config } from "dotenv";
import { clearDatabase } from "./seed";

// Load environment variables
config();

async function truncateDatabase() {
  try {
    console.log("🚀 Starting database truncation...");
    console.log("⚠️  NOTE: User table will be preserved!");
    await clearDatabase(true); // Pass true to close connection after truncation
    console.log("🎉 Database truncation completed successfully!");
    console.log("👥 User table and data remain intact.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Truncation failed:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  truncateDatabase();
}
