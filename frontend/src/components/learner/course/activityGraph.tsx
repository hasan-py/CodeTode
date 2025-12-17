import type { IActivityGraph } from "@packages/definitions";
import { Calendar } from "lucide-react";
import React, { useMemo, useState } from "react";

// Generates an array of date strings for the entire current year (Jan 1 - Dec 31)
const generateCurrentYearDates = (
  year: number = new Date().getFullYear()
): string[] => {
  const dates: string[] = [];
  // We start from January 1st of the specified year
  const startDate = new Date(year, 0, 1);
  // End at December 31st of the specified year
  const endDate = new Date(year, 11, 31);

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

// Processes raw data, fills missing days, and groups into weeks for the grid
const processActivityData = (
  rawActivityData: IActivityGraph[],
  year: number = new Date().getFullYear()
): Array<Array<IActivityGraph | null>> => {
  // Make sure we're only looking at the current year's data (Jan-Dec)
  // Filter data for the specific year only
  const filteredData = rawActivityData.filter((day) => {
    try {
      const dayYear = new Date(day.date).getFullYear();
      return dayYear === year;
    } catch (error) {
      console.error("Invalid date format:", day.date, error);
      return false;
    }
  });

  // Generate all dates for the current year (Jan-Dec)
  const allDates = generateCurrentYearDates(year);
  const activityMap = new Map<string, IActivityGraph>();

  // Create a map of activity data by date
  filteredData.forEach((day) => {
    activityMap.set(day.date.split("T")[0], {
      ...day,
      date: day.date.split("T")[0],
    });
  });
  // Helper function to ensure consistent activity level calculation
  const calculateActivityLevel = (xpEarned: number): number => {
    if (xpEarned === 0) return 0; // No activity
    if (xpEarned < 20) return 1; // Low activity
    if (xpEarned < 40) return 2; // Medium activity
    if (xpEarned < 60) return 3; // High activity
    return 4; // Very high activity
  };

  // Fill in any missing dates with zero activity and ensure proper activity level
  const fullYearData: IActivityGraph[] = allDates.map((date: string) => {
    const existingData = activityMap.get(date);
    if (existingData) {
      // Make sure activity level is correctly calculated based on XP
      // This ensures the color matches the activity intensity
      const activityLevel = calculateActivityLevel(existingData.xpEarned);
      return {
        ...existingData,
        activityLevel, // Force calculated level based on XP
      };
    }
    return {
      date,
      activityLevel: 0, // No activity (level 0)
      xpEarned: 0,
      lessons: 0,
    };
  });

  const graphWeeks: Array<Array<IActivityGraph | null>> = []; // Array of columns (weeks), each column is 7 days (rows)
  let currentColumn: Array<IActivityGraph | null> = new Array(7).fill(null);

  const firstDayOfPeriod = new Date(allDates[0]).getDay(); // 0 = Sun, 6 = Sat

  // Add initial null placeholders to the first column for days before the start date's day of the week
  for (let i = 0; i < firstDayOfPeriod; i++) {
    currentColumn[i] = null;
  }

  fullYearData.forEach((day) => {
    const dayOfWeek = new Date(day.date).getDay(); // 0 = Sun, 6 = Sat
    currentColumn[dayOfWeek] = day; // Place day in the correct row (day of week)

    // If it's Saturday (end of the week column), push the column and start a new one
    if (dayOfWeek === 6) {
      graphWeeks.push(currentColumn);
      currentColumn = new Array(7).fill(null);
    }
  });

  // Push the last partial week if it's not empty
  if (currentColumn.some((day) => day !== null)) {
    graphWeeks.push(currentColumn);
  }

  return graphWeeks;
};

// Gets Tailwind color class based on activity level
const getActivityColorClass = (level: number): string => {
  // Exactly 4 levels of activity (0-4)
  switch (level) {
    case 0: // No activity
      return "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700";
    case 1: // Low activity
      return "bg-emerald-200 dark:bg-emerald-900";
    case 2: // Medium activity
      return "bg-emerald-300 dark:bg-emerald-700";
    case 3: // High activity
      return "bg-emerald-400 dark:bg-emerald-600";
    case 4: // Very high activity
      return "bg-emerald-500 dark:bg-emerald-500";
    default:
      console.warn(`Unexpected activity level: ${level}`);
      return "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700";
  }
};

// --- Component Definition ---

type ActivityGraphProps = {
  data: IActivityGraph[];
  year?: number; // Optional year parameter
};

const ActivityGraph: React.FC<ActivityGraphProps> = ({
  data,
  year = new Date().getFullYear(),
}) => {
  // Fetch activity data for the current year from API
  // Make sure we fetch data for the full calendar year (Jan-Dec)
  const apiActivityData = data;

  // State to track the selected day for details display
  const [selectedDay, setSelectedDay] = useState<IActivityGraph | null>(null);

  // Process and organize data into weeks whenever API data or year changes
  // This transforms the raw API data into a format suitable for our grid display
  const graphWeeks = useMemo(() => {
    // Ensure we're working with a fresh copy of the data
    const dataCopy = [...(apiActivityData || [])];
    return processActivityData(dataCopy, year);
  }, [apiActivityData, year]);

  // Calculate month labels and their approximate column positions
  const monthLabels = useMemo(() => {
    // Array to store month labels and their positions
    const labels: { month: string; columnIndex: number }[] = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    if (graphWeeks.length === 0) return [];

    // Track the current month we're processing
    let currentMonth = -1;

    // For each week column, check if it contains the first day of a month
    graphWeeks.forEach((week, colIndex) => {
      // Find a valid day in this column
      const dayInCol = week.find((day) => day !== null);

      if (dayInCol) {
        const date = new Date(dayInCol.date);
        const monthOfThisWeek = date.getMonth();

        // If this is the first day of the month or a new month
        if (monthOfThisWeek !== currentMonth) {
          currentMonth = monthOfThisWeek;

          // Check if this day is the first of the month
          if (date.getDate() <= 7) {
            // Within the first week of the month
            labels.push({
              month: monthNames[currentMonth],
              columnIndex: colIndex,
            });
          }
        }
      }
    });

    // Make sure we have a label for January if it's not already there
    if (!labels.some((label) => label.month === "Jan")) {
      // Find the first column that has January dates
      for (let i = 0; i < graphWeeks.length; i++) {
        const janDay = graphWeeks[i].find(
          (day) => day && new Date(day.date).getMonth() === 0
        );
        if (janDay) {
          labels.unshift({ month: "Jan", columnIndex: i });
          break;
        }
      }
    }

    // Sort labels by column index to ensure proper order
    labels.sort((a, b) => a.columnIndex - b.columnIndex);

    // Simple filtering for overlapping/redundant labels (optional refinement)
    const filteredLabels: { month: string; columnIndex: number }[] = [];
    for (let i = 0; i < labels.length; i++) {
      const currentLabel = labels[i];
      const nextLabel = labels[i + 1];
      // Skip label if the next one is for the same month in the immediate next column
      if (
        nextLabel &&
        nextLabel.month === currentLabel.month &&
        nextLabel.columnIndex === currentLabel.columnIndex + 1
      ) {
        continue;
      }
      filteredLabels.push(currentLabel);
    }

    return filteredLabels;
  }, [graphWeeks]); // Recalculate when graphWeeks or year changes

  // Day of week labels for the Y-axis
  //   const dayOfWeekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header and Legend */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Learning Activity {year}
        </h2>
        {/* Color Legend with tooltips */}
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">Less</span>
          <div className="flex space-x-1">
            <div
              className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              title="No activity (0 XP)"
            ></div>
            <div
              className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900"
              title="Low activity (1-19 XP)"
            ></div>
            <div
              className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700"
              title="Medium activity (20-39 XP)"
            ></div>
            <div
              className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600"
              title="High activity (40-59 XP)"
            ></div>
            <div
              className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500"
              title="Very high activity (60+ XP)"
            ></div>
          </div>
          <span className="text-gray-600 dark:text-gray-400">More</span>
        </div>
      </div>

      {/* Graph Container: Fixed Day Labels + Scrollable Weeks */}
      <div className="flex">
        {/* Fixed Day Labels (Mon, Wed, Fri) */}
        {/* Use spacers to align with grid rows (Sun-Sat) */}
        <div className="flex flex-col justify-around text-xs text-gray-600 dark:text-gray-500 mr-1 mt-5">
          <div className="h-4"></div> {/* Sun row spacer */}
          <div className="h-4 flex items-center">Mon</div>
          <div className="h-4"></div> {/* Tue row spacer */}
          <div className="h-4 flex items-center">Wed</div>
          <div className="h-4"></div> {/* Thu row spacer */}
          <div className="h-4 flex items-center">Fri</div>
          <div className="h-4"></div> {/* Sat row spacer */}
        </div>

        {/* Scrollable Area for Activity Squares */}
        <div className="overflow-x-auto pb-2 flex-1">
          {/* Month Labels positioned absolutely above the columns */}
          {/* Needs fine-tuning based on square size and grid gap */}
          <div className="relative h-4 mb-1">
            {monthLabels.map(({ month, columnIndex }) => (
              <div
                key={month + columnIndex}
                className="absolute top-0 text-xs text-gray-600 dark:text-gray-500"
                // Approximate left position based on column index (w-4=16px, gap-0.5=2px)
                style={{ left: `${columnIndex * 14}px` }} // Adjusted multiplier to sync with updated square size (w-3 = 12px, gap-0.5 = 2px)
              >
                {month}
              </div>
            ))}
          </div>

          {/* The Main Activity Squares Grid */}
          {/* Grid: 7 rows (days Sun-Sat), Auto columns (weeks) flowing horizontally */}
          <div
            className="grid grid-flow-col grid-rows-7 gap-0.5"
            style={{ gridAutoColumns: "max-content" }} // Columns size to fit content
          >
            {/* Map over the weeks (columns) */}
            {graphWeeks.map((week, colIndex) => (
              <React.Fragment key={`week-col-${colIndex}`}>
                {/* Map over the days in the week (rows) */}
                {week.map((day, rowIndex) => (
                  <div
                    key={`day-${colIndex}-${rowIndex}`}
                    className={`w-3 h-3 rounded-sm 
                                ${
                                  day
                                    ? getActivityColorClass(day.activityLevel)
                                    : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                }
                                 ${
                                   day
                                     ? "cursor-pointer hover:ring-1 hover:ring-gray-500 dark:hover:ring-white hover:ring-opacity-50 transition-all"
                                     : "opacity-40"
                                 }
                              `}
                    title={
                      day
                        ? `${day.date}: ${day.xpEarned} XP earned, ${day.lessons} lessons completed (Level ${day.activityLevel})`
                        : "No data for this day"
                    }
                    onClick={() => day && setSelectedDay(day)} // Set selected day on click
                  ></div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Day Details Display */}
      {selectedDay && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-sm">
          <div className="font-medium text-gray-900 dark:text-white">
            {selectedDay.date}
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            {selectedDay.xpEarned} XP earned
          </div>
          <div className="text-gray-700 dark:text-gray-300">
            {selectedDay.lessons}{" "}
            {selectedDay.lessons === 1 ? "lesson" : "lessons"} completed
          </div>
          {/* Add other relevant details here from selectedDay */}
        </div>
      )}
    </div>
  );
};

export default ActivityGraph;
