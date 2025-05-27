import React from "react";
import { Card, Typography, Space, List, Divider } from "antd";
import TrainingCalendar from "../addStatisticCalendarElement"; // Assuming this is the correct path to your calendar component
import OverallMuscleStats from "../addOverallMuscleStatsElement"; // Assuming this is the correct path to your muscle stats component

const { Title, Text } = Typography;

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
        alignItems: "center",
        gap: 20,
      }}
    >
      <div style={{ flex: 1 }}>
        <TrainingCalendar statistics={user.statistic} />
      </div>
      <div style={{ flex: 1 }}>
        <OverallMuscleStats statistics={user.statistic} />
      </div>
    </div>

    <Typography.Title level={4}>Деталі тренування</Typography.Title>
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", overflow: "auto", maxHeight: "70vh" }}
    >
      {user?.statistic.map((session, idx) => (
        <Card
          key={idx}
          title={`${new Date(
            session.startTime
          ).toLocaleDateString()} — ${Math.round(
            session.trainingTime / 60
          )} хв`}
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
        >
          <List
            itemLayout="vertical"
            dataSource={session.data}
            renderItem={(exercise, i) => {
              return (
                <List.Item key={i} style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <Title level={5}>{exercise.name}</Title>
                  {exercise.description && (
                    <Text type="secondary">{exercise.description}</Text>
                  )}
                  <Divider />
                  <Text strong>Обладнання: </Text>
                  {exercise.equipment?.join(", ") || "—"}
                  <br />
                  <Text strong>Тренер: </Text>
                  {exercise.trainer || "—"}
                  <br />
                  <Text strong>Сети / Повторення: </Text>
                  {exercise.sets} × {exercise.reps}
                  <br />
                  <Text strong>Час відпочинку: </Text>
                  {exercise.restTime}
                </List.Item>
              );
            }}
          />
        </Card>
      ))}
    </Space>
  </Space>
);

export default WorkoutStatisticSection;
