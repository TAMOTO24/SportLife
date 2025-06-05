import {
  Card,
  Avatar,
  Divider,
  Tag,
  List,
  Typography,
  Statistic,
  Row,
  Col,
  Empty,
} from "antd";
import {
  BarChartOutlined,
  ClockCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";
import OverallMuscleStats from "../addOverallMuscleStatsElement";

const { Title, Text, Paragraph } = Typography;

const PersonalTrainerBlock = ({ user }) => {
  if (!user) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9f9f9",
          borderRadius: "12px",
          border: "1px solid #eee",
          margin: "20px",
        }}
      >
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Записаного користувача не знайдено"
        />
      </div>
    );
  }

  const trainings = user.statistic || [];
  const lastTraining = trainings[trainings.length - 1];

  const totalTrainingTime = trainings.reduce(
    (acc, t) => acc + (t.trainingTime || 0),
    0
  );

  const totalExercises = trainings.reduce(
    (acc, t) => acc + (t.data?.length || 0),
    0
  );

  const muscleMap = {};
  trainings.forEach((t) => {
    t.data?.forEach((ex) => {
      Object.entries(ex.muscleGroups || {}).forEach(([muscle, value]) => {
        muscleMap[muscle] = (muscleMap[muscle] || 0) + value;
      });
    });
  });

  const sortedMuscles = Object.entries(muscleMap).sort((a, b) => b[1] - a[1]);

  return (
    <>
      <h1>Записаний клієнт</h1>
      <Card style={{ margin: "0 auto", overflow: "auto", maxHeight: "90vh" }}>
        <Card.Meta
          avatar={<Avatar size={64} src={user.profile_picture} />}
          title={`${user.name} ${user.last_name}`}
          description={user.profileDescription || "Немає опису профілю"}
        />
        <Divider />

        <Title level={4}>Контактна інформація</Title>
        <p>
          <Text strong>Email:</Text> {user.email}
        </p>
        <p>
          <Text strong>Телефон:</Text> {user.phone}
        </p>
        <p>
          <Text strong>Стать:</Text>{" "}
          {user.gender === "male" ? "Чоловіча" : "Жіноча"}
        </p>

        <Divider />

        <Title level={4}>Загальна статистика</Title>
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Тренувань"
              value={trainings.length}
              prefix={<BarChartOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Хвилин загалом"
              value={Math.round(totalTrainingTime / 60)}
              prefix={<ClockCircleOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Середня тривалість"
              value={
                trainings.length
                  ? Math.round(totalTrainingTime / trainings.length / 60)
                  : 0
              }
              suffix="хв"
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Усього вправ"
              value={totalExercises}
              prefix={<FireOutlined />}
            />
          </Col>
        </Row>

        <Divider />

        <Title level={4}>Найбільше задіяні м’язи</Title>
        {sortedMuscles.length ? (
          sortedMuscles.slice(0, 5).map(([muscle, value]) => (
            <Tag key={muscle} color="geekblue">
              {muscle} ({value}%)
            </Tag>
          ))
        ) : (
          <Text>Немає інформації</Text>
        )}

        <Divider />

        <Title level={4}>Відсоток навантаження</Title>
        <OverallMuscleStats statistics={trainings} />

        <Divider />

        <Title level={4}>Останнє тренування</Title>
        {lastTraining ? (
          <>
            <p>
              <Text strong>Час тренування:</Text>{" "}
              {Math.round(lastTraining.trainingTime / 60)} хв
            </p>
            <List
              header={<Text strong>Вправи:</Text>}
              bordered
              dataSource={lastTraining.data}
              renderItem={(exercise) => (
                <List.Item>
                  <div style={{ width: "100%" }}>
                    <Title level={5}>{exercise.name}</Title>
                    <Text>
                      Повторень: {exercise.reps} | Підходів: {exercise.sets} |
                      Відпочинок: {exercise.restTime}
                    </Text>
                    <br />
                    <Text>Основні м’язи:</Text>{" "}
                    {Object.entries(exercise.muscleGroups).map(
                      ([muscle, percent]) => (
                        <Tag key={muscle} color="blue">
                          {muscle} — {percent}%
                        </Tag>
                      )
                    )}
                    <Paragraph>
                      <Text strong>Опис:</Text> {exercise.description}
                    </Paragraph>
                    <Paragraph>
                      <Text strong>Поради:</Text> {exercise.tips.join(", ")}
                    </Paragraph>
                  </div>
                </List.Item>
              )}
            />
          </>
        ) : (
          <Text>Немає даних про тренування</Text>
        )}
      </Card>
    </>
  );
};

export default PersonalTrainerBlock;
