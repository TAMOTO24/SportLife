import React from "react";
import TrainerCardElement from "../addTrainerCardElement";
import { Divider, Typography, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const TrainersPage = () => {
  return (
    <div style={{ padding: "40px 24px", margin: "0 auto" }}>
      <div
        style={{
          background: "linear-gradient(135deg, #e6f7ff, #ffffff)",
          padding: "40px 30px",
          borderRadius: 16,
          textAlign: "center",
          boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
        }}
      >
        <Title level={1} style={{ fontSize: "48px", marginBottom: 10 }}>
          <UserOutlined
            style={{ fontSize: 42, marginRight: 12, color: "#1890ff" }}
          />
          Наші Тренери
        </Title>
        <Paragraph
          style={{
            fontSize: "18px",
            color: "#555",
            maxWidth: 800,
            margin: "0 auto",
          }}
        >
          Знайомтеся з нашими професійними тренерами, які допоможуть вам досягти
          найкращих результатів у вашій фітнес-подорожі. Вони мотивують,
          надихають і підтримують кожного на шляху до мети.
        </Paragraph>
      </div>

      <Divider style={{ marginTop: 40, marginBottom: 40 }} />

      <div>
        <TrainerCardElement />
      </div>
    </div>
  );
};

export default TrainersPage;
