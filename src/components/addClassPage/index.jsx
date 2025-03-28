import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Typography, Row, Col, Image, Button, Space } from "antd";
import { Link} from "react-router-dom";
import "./style.css";
import { PieChart, Pie } from "recharts";

const { Title, Paragraph } = Typography;

const ClassPage = () => {
  const location = useLocation();
  const { workout } = location.state || {};

  return (
    <div
      className="classPage"
      style={{
        backgroundImage: `url(${workout.img[0]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="classBlock">
        <div className="classUpperPanel">
          <img src="./img-pack/logo/logo2_white.png" alt="Logo" id="logo" />
          <div id="login-text">
            Don't have an account? <a href="#">Register</a>!
          </div>
        </div>
        <hr />

        <div className="textSection">
          <Title level={2} style={{ color: "white" }}>
            {workout.title}
          </Title>
          <Paragraph style={{ color: "#a8acb1", fontSize: "18px" }}>
            <strong>Trainer:</strong> {workout.trainer}
          </Paragraph>
          <Paragraph style={{ color: "#a8acb1", fontSize: "18px" }}>
            <strong>Description:</strong> {workout.description}
          </Paragraph>
        </div>

        <div className="typeSection">
          <Title level={3} style={{ color: "white", marginTop: "40px" }}>
            Workout Types
          </Title>
          <Row gutter={16}>
            {workout.type.map((type, index) => (
              <Col span={8} key={index}>
                <Card
                  title={
                    <span style={{ color: "white", fontSize: "25px" }}>
                      {type}
                    </span>
                  }
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    border: "none",
                    color: "white",
                    padding: "20px",
                    borderRadius: "10px",
                  }}
                >
                  <Paragraph style={{ color: "#a8acb1", fontSize: "16px" }}>
                    This section focuses on {type.toLowerCase()} exercises.
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        <div className="gallerySection">
          <Title level={3} style={{ color: "white", marginTop: "40px" }}>
            Image Gallery
          </Title>
          <Row gutter={16}>
            {workout.img.map((image, index) => (
              <Col span={8} key={index}>
                <Image
                  width="100%"
                  height="auto"
                  src={image}
                  alt={`gallery-image-${index}`}
                  style={{ borderRadius: "10px", cursor: "pointer" }}
                />
              </Col>
            ))}
          </Row>
        </div>

        <div className="detailsSection">
          <Title level={3} style={{ color: "white", marginTop: "40px" }}>
            Additional Details
          </Title>
          <Paragraph style={{ color: "#a8acb1", fontSize: "18px" }}>
            <strong>Warm up Duration:</strong> {workout.workoutplan["Warm up"]}{" "}
            min
          </Paragraph>
          <Paragraph style={{ color: "#a8acb1", fontSize: "18px" }}>
            <strong>Exercise Machines: </strong>
            {""}
            {workout.exercise_machines.join(", ")}
          </Paragraph>
          <hr />
          <Paragraph style={{ color: "#a8acb1", fontSize: "30px" }}>
            <strong>Body activity: </strong>
          </Paragraph>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PieChart width={800} height={400}>
              <Pie
                dataKey="A"
                data={workout.body_activity}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name }) => name}
              />
            </PieChart>
          </div>

          <Space>
            <Button type="primary" style={{ backgroundColor: "#f56a00" }}>
              Book Now
            </Button>
            <Button type="primary">
              <Link to="/workoutprogress" state={{ currentWorkout: workout }}>Start workout</Link>
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
