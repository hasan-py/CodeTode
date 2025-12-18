import type { IDashboardStatistics } from "@packages/definitions";
import type { ReactElement } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CustomTickProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
}

const truncateText = (text: string, maxLength: number): string => {
  if (text?.length <= maxLength) {
    return text;
  }
  return `${text?.substring(0, maxLength)}...`;
};

const CustomizedYAxisTick = (props: CustomTickProps): ReactElement => {
  const { x, y, payload } = props;
  const label = payload?.value || "";

  const truncatedLabel = truncateText(label?.toString(), 25);

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4} // Small vertical offset for better alignment
        textAnchor="end" // Align text to the end (right side)
        fill="#6B7280"
        className="text-sm dark:fill-[#9ca3af]"
      >
        {truncatedLabel}
      </text>
    </g>
  );
};

type propsType = IDashboardStatistics["courseEnrollments"];

function CourseEnrollmentChart({ data }: { data: propsType }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Course Enrollments
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              className="dark:stroke-[#374151]"
            />
            <XAxis
              type="number"
              stroke="#6b7280"
              className="dark:stroke-[#9ca3af]"
              allowDecimals={false} // Prevent decimal points for student counts
            />
            <YAxis
              dataKey="name"
              type="category"
              // Set a fixed width for the axis area
              width={200}
              // Pass your custom component to the tick prop
              tick={<CustomizedYAxisTick />}
              // Optional: To prevent Recharts from auto-adding its own ellipsis
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderColor: "#e5e7eb",
                color: "#111827",
                borderRadius: "0.5rem",
              }}
              itemStyle={{ color: "#111827" }}
              cursor={{ fill: "#f3f4f6", fillOpacity: 0.5 }}
            />
            <Legend />
            <Bar dataKey="students" name="Students Enrolled" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CourseEnrollmentChart;
