import React from "react";
import { Typography, Button, Card, Image } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import { LeftOutlined } from "@ant-design/icons";
import "./style.css";

const { Title, Paragraph } = Typography;
const { Meta } = Card;

const InfoTrainersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainer_info } = location.state || {};

  return (
    <>
      {/* <Button icon={<LeftOutlined />}>Back</Button> */}
      <div class="trainers-nav" onClick={() => navigate(-1)}>
        <div class="back-button">
          <LeftOutlined /> Back
        </div>
      </div>
      <div className="container">
        <Card hoverable>
          <Paragraph>
            <strong>Title:</strong> {trainer_info.title}
          </Paragraph>
          <Paragraph>
            <strong>Training Type:</strong> {trainer_info.training_type}
          </Paragraph>
          <Paragraph>
            <strong>Info:</strong> {trainer_info.info}
          </Paragraph>
          <Paragraph>
            <strong>User ID:</strong> {trainer_info.user_id}
          </Paragraph>
          <Paragraph>
            <strong>Trainer ID:</strong> {trainer_info._id}
          </Paragraph>
        </Card>
        <Card
          style={{ width: "30%" }}
          hoverable
          cover={<Image alt="example" src={trainer_info.profile_img} />}
        >
          <Title level={2} className="title">
            Trainer Information
          </Title>
          {trainer_info ? (
            <>
              <Paragraph>
                <strong>Title:</strong> {trainer_info.title}
              </Paragraph>
              <Paragraph>
                <strong>Training Type:</strong> {trainer_info.training_type}
              </Paragraph>
              <Paragraph>
                <strong>Info:</strong> {trainer_info.info}
              </Paragraph>
              <Paragraph>
                <strong>User ID:</strong> {trainer_info.user_id}
              </Paragraph>
              <Paragraph>
                <strong>Trainer ID:</strong> {trainer_info._id}
              </Paragraph>
            </>
          ) : (
            <Paragraph className="no-info">
              No trainer information available.
            </Paragraph>
          )}
        </Card>
      </div>
    </>
  );
};

export default InfoTrainersPage;
