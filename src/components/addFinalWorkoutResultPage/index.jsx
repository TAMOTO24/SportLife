import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Typography, Divider, Space, Tag } from "antd";
import { HomeOutlined, SaveOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const WorkoutResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state?.result;

  if (!resultData) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Title level={4}>
          Немає даних для відображення результату тренування
        </Title>
      </div>
    );
  }

  return (
    <div style={{ padding: 40, maxWidth: 1000, margin: "0 auto" }}>
      <Card
        bordered={false}
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderRadius: 12 }}
      >
        <Title level={2}>Результат тренування</Title>

        <Divider />

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Text>
            <strong>Час початку:</strong>{" "}
            {new Date(resultData.startTime).toLocaleString()}
          </Text>
          <Text>
            <strong>Тривалість:</strong> {resultData.trainingTime}
          </Text>
          <Text>
            <strong>ID користувача:</strong> {resultData.userId}
          </Text>
          <Text>
            <strong>ID кімнати:</strong> {resultData.roomId}
          </Text>
          <Text>
            <strong>Кількість вправ:</strong> {resultData.exerciseCount}
          </Text>
        </Space>

        <Divider />

        <Title level={4}>Програма тренування</Title>
        <Paragraph>
          <Text strong>Назва:</Text> {resultData.workout?.title}
        </Paragraph>
        <Paragraph>
          <Text strong>Опис:</Text> {resultData.workout?.description}
        </Paragraph>
        <Paragraph>
          <Text strong>Тип:</Text>{" "}
          <Tag color="blue">{resultData.workout?.type}</Tag>
        </Paragraph>

        <Divider />

        <Title level={4}>Виконані вправи</Title>
        <div
          style={{ maxHeight: "400px", overflowY: "auto", paddingRight: 10 }}
        >
          {resultData.data?.map((exercise, index) => (
            <Card
              key={index}
              type="inner"
              title={exercise.name}
              style={{ marginBottom: 16, borderRadius: 10 }}
            >
              <Text>
                <strong>М'язи:</strong>
              </Text>
              <div style={{ marginBottom: 8 }}>
                {Object.entries(exercise.muscleGroups).map(
                  ([muscle, value]) => (
                    <Tag key={muscle} color="geekblue">
                      {muscle}: {value}%
                    </Tag>
                  )
                )}
              </div>

              <Space direction="vertical" size="small">
                <Text>
                  <strong>Підходи:</strong> {exercise.sets},{" "}
                  <strong>Повтори:</strong> {exercise.reps}
                </Text>
                <Text>
                  <strong>Обладнання:</strong> {exercise.equipment}
                </Text>
                <Text>
                  <strong>Техніка:</strong> {exercise.technique}
                </Text>
                <Text>
                  <strong>Поради:</strong> {exercise.tips}
                </Text>
                <Text>
                  <strong>Відпочинок:</strong> {exercise.restTime} сек
                </Text>
              </Space>
            </Card>
          ))}
        </div>

        <Divider />

        <div style={{ textAlign: "right" }}>
          <p
            style={{
              backgroundColor: "#f6ffed",
              border: "1px solid #b7eb8f",
              padding: "10px 16px",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: 16,
              color: "#389e0d",
              marginTop: 20,
            }}
          >
            <SaveOutlined />
            Результат збережено!
          </p>
          <Button
            style={{ marginLeft: 12 }}
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
          >
            На головну
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WorkoutResult;
