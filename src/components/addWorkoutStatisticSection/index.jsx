import { Space } from "antd";
import TrainingCalendar from "../addStatisticCalendarElement"; // Assuming this is the correct path to your calendar component
import OverallMuscleStats from "../addOverallMuscleStatsElement"; // Assuming this is the correct path to your muscle stats component


const WorkoutStatisticSection = ({ user }) => (
  <Space
    direction="vertical"
    style={{
      width: "100%",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ flex: 1 }}>
        <TrainingCalendar statistics={user.statistic} />
      </div>
      <div style={{ flex: 1, width: "100%" }}>
        <OverallMuscleStats statistics={user.statistic} />
      </div>
    </div>
  </Space>
);

export default WorkoutStatisticSection;
