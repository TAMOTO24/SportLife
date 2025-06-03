import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  Typography,
  Row,
  Col,
  Image,
  Button,
  Space,
} from "antd";
import { Link, useParams } from "react-router-dom";
import "./style.css";
import { PieChart, Pie } from "recharts";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import BookMark from "../addBookMarkElement/index";
import Loading from "../addLoadingElement";

const { Title, Paragraph } = Typography;

const ClassPage = () => {
  const location = useLocation();
  const { workoutId } = useParams();
  // const [RoomId] = useState(Cookies.get("roomId"));
  const { workout } = location.state || {};
  const [workoutState, setWorkoutState] = useState(workout);
  const uniqueUIDV4Id = uuidv4();

  useEffect(() => {
    axios
      .get(`/workoutbyid/${workoutId}`)
      .then((response) => {
        setWorkoutState(response.data);
      })
      .catch((error) => console.error(error));
  }, []);

  // useEffect(() => {
  //   const existingRoomId = Cookies.get("roomId");
  //   if (!existingRoomId) {
  //     Cookies.set("roomId", uniqueUIDV4Id, { expires: 0.25 });
  //   } else {
  //     setUniqueUIDV4Id(existingRoomId);
  //   }
  // }, []);

  return workoutState ? (
    <div
      className="classPage"
      style={{
        backgroundImage:
          workoutState.img && workoutState.img.length >= 0
            ? `url(${workoutState.img[0]})`
            : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="classBlock">
        <div className="classUpperPanel">
          <img src="/img-pack/logo/logo2_white.png" alt="Logo" id="logo" />
          <div id="login-text">
            Don't have an account? <a href="#">Register</a>!
          </div>
        </div>
        <hr />

        <div className="textSection">
          <Title level={2} style={{ color: "white" }}>
            {workoutState.title}
          </Title>
          <Paragraph style={{ color: "#a8acb1", fontSize: "18px" }}>
            <strong>Trainer:</strong> {workoutState.trainer}
          </Paragraph>
          <Paragraph style={{ color: "#a8acb1", fontSize: "18px" }}>
            <strong>Description:</strong> {workoutState.description}
          </Paragraph>
        </div>

        <div className="typeSection">
          <Title level={3} style={{ color: "white", marginTop: "40px" }}>
            Workout Types
          </Title>
          <Row gutter={16}>
            {workoutState.type.map((type, index) => (
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
            {workoutState.img.map((image, index) => (
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
            <strong>Warm up Duration:</strong>{" "}
            {workoutState.workoutplan["Warm up"]} min
          </Paragraph>
          <Paragraph style={{ color: "#a8acb1", fontSize: "18px" }}>
            <strong>Exercise Machines: </strong>
            {""}
            {workoutState.exercise_machines.join(", ")}
          </Paragraph>
          <hr />
          <Paragraph style={{ color: "#a8acb1", fontSize: "30px" }}>
            <strong>Body activity: </strong>
          </Paragraph>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PieChart width={800} height={400}>
              <Pie
                dataKey="A"
                data={workoutState.body_activity}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name }) => name}
              />
            </PieChart>
          </div>

          <Space>
            <BookMark element={workoutState} theme={false} />
            <Button type="primary">
              <Link
                to={`/workoutroom/${uniqueUIDV4Id}`}
                state={{ workouts: workoutState }}
              >
                {/* {RoomId ? "Join created room" : "Create new room"} */}
                Create new room
              </Link>
            </Button>
          </Space>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ClassPage;
