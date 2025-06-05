import React from "react";
import { Typography, Button, Card, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import { LeftOutlined } from "@ant-design/icons";
import "./style.css";

const { Title, Paragraph } = Typography;

const InfoTrainersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainer_info } = location.state || {};

  if (!trainer_info) {
    return (
      <div className="container" style={{ padding: 20 }}>
        <Button
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 20 }}
        >
          Back
        </Button>
        <Paragraph>Інформація про тренера відсутня.</Paragraph>
      </div>
    );
  }

  return (
    <>
      <div className="trainers-nav" onClick={() => navigate(-1)} style={{ cursor: "pointer", padding: "10px 20px" }}>
        <div className="back-button" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <LeftOutlined />
          Back
        </div>
      </div>
      <div className="container" style={{ display: "flex", gap: 24, padding: 20 }}>
        <Card
          style={{ flex: 1, maxWidth: 600 }}
          hoverable
          title={<Title level={2}>Інформація про тренера</Title>}
        >
          <Paragraph>
            <strong>Титул:</strong> {trainer_info.title}
          </Paragraph>
          <Paragraph>
            <strong>Тип тренування:</strong> {trainer_info.training_type}
          </Paragraph>
          <Paragraph>
            <strong>User ID:</strong> {trainer_info.userId}
          </Paragraph>
          <Paragraph>
            <strong>Trainer ID:</strong> {trainer_info._id}
          </Paragraph>
        </Card>

        <Card
          style={{ width: "50vw" }}
          cover={<Image alt={trainer_info.title} src={trainer_info.profile_img} />}
        >
          <strong>Інформація:</strong> {trainer_info.info}
        </Card>
      </div>
    </>
  );
};

export default InfoTrainersPage;
