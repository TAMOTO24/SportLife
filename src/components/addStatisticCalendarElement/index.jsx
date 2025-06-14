import { Calendar, Tooltip as AntdTooltip } from "antd";

const TrainingCalendar = ({ statistics }) => {
  const trainingDates = statistics.map((s) =>
    new Date(s.startTime * 1000).toDateString()
  );

  const dateCellRender = (value) => {
    const date_str = value.toDate().toDateString();

    return (
      <AntdTooltip
        title={
          trainingDates.includes(date_str)
            ? "Було тренування"
            : "Відсутня активність"
        }
      >
        <div
          style={{
            background: trainingDates.includes(date_str) ? "#52c41a" : "gray",
            width: "100%",
            height: 10,
            borderRadius: 2,
          }}
        />
      </AntdTooltip>
    );
  };

  return (
    <Calendar
      fullscreen={false}
      cellRender={dateCellRender}
      style={{
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    />
  );
};

export default TrainingCalendar;
