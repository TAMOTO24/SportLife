import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
} from "antd";

// Define colors for the pie chart segments
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#d0ed57",
];

const OverallMuscleStats = ({ statistics }) => {
  const muscleSummary = {};

  statistics.forEach((session) => {
    session.data?.forEach((exercise) => {
      const groups = exercise.muscleGroups || {};
      Object.entries(groups).forEach(([muscle, value]) => {
        muscleSummary[muscle] = (muscleSummary[muscle] || 0) + value;
      });
    });
  });

  const total = Object.values(muscleSummary).reduce((sum, val) => sum + val, 0);

  const chartData = Object.entries(muscleSummary).map(([name, value]) => ({
    name,
    value: Number(((value / total) * 100).toFixed(1)),
  }));

  return (
    <Card
      title="Загальне навантаження на м’язи (%)"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
    >
      {chartData.length === 0 ? (
        <p>Немає даних для побудови статистики</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <ReTooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default OverallMuscleStats;