import React from "react";
import dayjs from "dayjs";
import { formatTime } from "../../function";
import { Card, Typography, Space, List, Descriptions } from "antd";

const { Title, Text } = Typography;

const WorkoutResultsSection = ({ user }) => {
  return (
    <>
      <Typography.Title level={4}>Деталі тренування</Typography.Title>
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", overflow: "auto", maxHeight: "93vh" }}
      >
        {user?.statistic && user.statistic.length > 0 ? (
          user.statistic.map((session, idx) => (
            <Card
              key={idx}
              title={`📅 ${dayjs(session.startTime * 1000).format(
                "DD.MM.YYYY"
              )} • 🕒 ${formatTime(session.trainingTime)}`}
              style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              <Descriptions title={session.workout.title}>
                <Descriptions.Item label="Опис">
                  {session.workout.description}
                </Descriptions.Item>
                <Descriptions.Item label="Тренер">
                  {session.workout.trainer}
                </Descriptions.Item>
              </Descriptions>

              <List
                itemLayout="vertical"
                dataSource={session.data}
                renderItem={(exercise, i) => (
                  <List.Item
                    key={i}
                    style={{ paddingLeft: 0, paddingRight: 0 }}
                  >
                    <Title level={5}>{exercise.name}</Title>
                    {exercise.description && (
                      <Text type="secondary">{exercise.description}</Text>
                    )}
                    <br />
                    <Text strong>Сети / Повторення: </Text>
                    {exercise.sets} × {exercise.reps}
                    <br />
                    <Text strong>Час відпочинку: </Text>
                    {exercise.restTime}
                  </List.Item>
                )}
              />
            </Card>
          ))
        ) : (
          <Card>
            <Typography.Text type="secondary">
              Наразі немає даних про тренування.
            </Typography.Text>
          </Card>
        )}
      </Space>
    </>
  );
};

export default WorkoutResultsSection;
