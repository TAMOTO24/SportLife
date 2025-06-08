import React from "react";
import { Typography, Button, Card, Image, Divider } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
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
          Назад
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
          Назад
        </div>
      </div>

      <div className="container" style={{ display: "flex", gap: 24, padding: 20, flexWrap: "wrap" }}>
        <Card
          hoverable
          title={<Title level={2}>Інформація про тренера</Title>}
        >
          <Paragraph>
            <strong>Ім’я:</strong> {trainer_info.name}
          </Paragraph>
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
          <Divider />
          <Paragraph>
            <strong>Освіта:</strong> {trainer_info.education}
          </Paragraph>
          <Paragraph>
            <strong>Цільова аудиторія:</strong> {trainer_info.targetAudience}
          </Paragraph>
        </Card>

        <Card
          cover={
            <Image
              alt={trainer_info.title}
              src={trainer_info.profile_img}
              style={{ objectFit: "cover", maxHeight: 900 }}
            />
          }
        >
          <Paragraph>
            <strong>Біографія:</strong> {trainer_info.bio}
          </Paragraph>

          <Divider />
          <Paragraph><strong>Філософія тренувань:</strong></Paragraph>
          <ul>
            {trainer_info.philosophy?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          <Divider />
          <Paragraph><strong>Досягнення:</strong></Paragraph>
          <ul>
            {trainer_info.achievements?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
};

export default InfoTrainersPage;
