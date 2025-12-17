import type {
  TAggregatedLearnerStats,
  TFormattedLearnerInfo,
  TLearnerStats,
} from "@packages/definitions";

/**
 * Processes a flat list of user course enrollments and groups them by user,
 * calculating aggregated stats and formatting them for display.
 * @param data - The raw array of user enrollment records.
 * @returns An array of formatted user profiles.
 */
export function formattedLearnerStats(
  data: TLearnerStats[]
): TFormattedLearnerInfo[] {
  // Use a Map to group records by userid for efficient aggregation
  const userMap = new Map<number, TAggregatedLearnerStats>();

  // --- Step 1: Group and Aggregate the data ---
  for (const record of data) {
    // Check if we've seen this user before
    let currentUser = userMap.get(record.userid);

    if (!currentUser) {
      // If it's a new user, create their initial aggregated profile
      currentUser = {
        userid: record.userid,
        email: record.email,
        name: record.name,
        imageUrl: record.imageurl || "",
        joinedat: record.joinedat,
        status: record.status,
        totalXp: record.totalxp,
        currentStreak: record.currentstreak,
        courses: [],
        totalSpent: 0,
      };
      userMap.set(record.userid, currentUser);
    }

    // Add the course details and update spending for the current user
    const completed = Number(record.completedlessons);
    const total = Number(record.totallessons);
    const progress = total > 0 ? (completed / total) * 100 : 0;

    currentUser.courses.push({
      name: record.coursename,
      progress: progress,
    });

    currentUser.totalSpent += Number(record.courseprice);
  }

  // --- Step 2: Format the aggregated data into the final structure ---
  const formattedUserList = Array.from(userMap.values()).map((user) => {
    // Format dates, numbers, and lists into readable strings
    const memberSince = new Date(user.joinedat).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const currentProgressList = user.courses.map((course) => ({
      name: course.name,
      progress: +course.progress,
    }));

    const totalSpent = `$${user.totalSpent.toFixed(2)}`;

    const formattedUser: TFormattedLearnerInfo = {
      userid: user.userid,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl || "",
      memberSince: memberSince,
      status: user.status.charAt(0).toUpperCase() + user.status.slice(1), // Capitalize
      enrolledCourses: user.courses.length,
      totalXp: user.totalXp,
      currentStreak: `${user.currentStreak} days`,
      currentProgressList: currentProgressList,
      totalSpent: totalSpent,
    };

    return formattedUser;
  });

  return formattedUserList;
}
