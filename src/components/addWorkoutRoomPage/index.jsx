import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../function.js";
import axios from "axios";
import {
  List,
  message,
  Button,
  Spin,
  Card,
  Space,
  Divider,
  Avatar,
  Switch,
} from "antd";
import { Typography } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createNotification } from "../../function.js";
import InviteUser from "../addInviteUserElement/index.jsx";
import "./style.css";

const { Title } = Typography;

export default function RoomPage() {
  const location = useLocation();
  const [uniqueUIDV4Id] = useState(useParams().roomId);
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { workouts } = location.state || {};

  const [users, setUsers] = useState([]);
  const [isOwner, setOwner] = useState(false);
  const [allUsers, setAllusers] = useState([]);
  const [cameraAccess, setCameraAccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axios.get("/allusers");
        setAllusers(response.data);
      } catch (error) {
        console.error("Error in useEffect:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/currentuserdata")
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => console.error("Auth error", error))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("IN ROOM USEEFFECT", socket.connected);
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
      console.log("CONNECT");
    } else {
      socket.emit("getAllRoomUsers", { roomId: uniqueUIDV4Id });
    }

    socket.on("connect", async () => {
      socket.emit("update-camera-status", {
        roomId: uniqueUIDV4Id,
        status: false,
      });
      socket.emit("joinRoom", { roomId: uniqueUIDV4Id, userId: user._id });
      socket.emit("getRoomOwner", { roomId: uniqueUIDV4Id });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket.io connection error:", err.message);
    });

    socket.on("roomClosed", () => {
      message.warning("Кімнату закрито — творець вийшов");
      navigate("/", { replace: true });
    });

    socket.on("chatHistory", (user) => {
      setUsers(user);
    });

    socket.on("roomOwner", (ownerId) => {
      setOwner(ownerId === user._id);
    });

    socket.on("camera-status-updated", (status) => {
      setCameraAccess(status);
    });

    socket.on("redirect", () => {
      if (!isOwner)
        navigate(`/workoutprogress/${uniqueUIDV4Id}`, { replace: true });
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("chatHistory");
      socket.off("roomOwner");
      socket.off("receiveUpdate");
      socket.off("camera-status-updated");
    };
  }, [user, uniqueUIDV4Id, navigate, location]);

  const sendRequest = (id) => {
    createNotification(
      "Запрошення",
      "Запрошення на приєднання до кімнати",
      "info",
      id,
      "",
      uniqueUIDV4Id,
      "roomRequest"
    );
    message.success("Запрошення надіслано!");
  };
  const disconnectSocket = () => {
    if (socket.connected) {
      socket.emit("disconnectData", {
        roomId: uniqueUIDV4Id,
        userId: user._id,
      });
      navigate("/", { replace: true });
      console.log("Socket disconnected");
      socket.disconnect();
    } else {
      console.error("❌ Socket is not connected");
    }
  };
  const handleToggle = (checked) => {
    setCameraAccess(checked);
    socket.emit("update-camera-status", {
      roomId: uniqueUIDV4Id,
      status: checked,
    });
  };

  return (
    <>
      <div className="border-room-page">
        <div
          className="room-page"
          style={{
            backgroundImage: workouts?.img
              ? `url(${workouts.img[0]})`
              : "url(/img-pack/page1.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      <Spin spinning={loading} tip="Завантаження...">
        <Card bordered className="room-content">
          <Title level={3} style={{ textAlign: "center" }}>
            Створення кімнати
          </Title>

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Space direction="horizontal">
              {isOwner && (
                <InviteUser
                  userId={user?._id}
                  message={"Надіслати запрошення"}
                  sendFunction={sendRequest}
                />
              )}

              <Button
                danger
                type="primary"
                onClick={() => {
                  disconnectSocket();
                  navigate("/", { replace: true });
                }}
              >
                Відключитися
              </Button>
              {isOwner && (
                <>
                  <span style={{ marginRight: 8, color: "black" }}>
                    Перемикач камери:
                  </span>
                  <Switch checked={cameraAccess} onChange={handleToggle} />
                </>
              )}
            </Space>

            {isOwner && (
              <Link
                to={`/workoutprogress/${uniqueUIDV4Id}`}
                state={{ currentWorkout: workouts, cameraAccess }}
              >
                <Button
                  type="primary"
                  block
                  onClick={() => {
                    socket.emit("redirectAll", { roomId: uniqueUIDV4Id });
                  }}
                >
                  Почати тренування
                </Button>
              </Link>
            )}

            <Divider>Учасники</Divider>

            <List
              bordered
              dataSource={users}
              renderItem={(userId, i) => {
                const commentUser = allUsers.find((u) => u._id === userId);
                if (!commentUser) return null;

                return (
                  <List.Item key={i}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Avatar
                        size={60}
                        src={
                          commentUser.profile_picture ||
                          "/img-pack/icons/user-blacktheme.png"
                        }
                      />
                      <div>
                        <strong>
                          {commentUser.name} {commentUser.last_name || ""}
                        </strong>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {commentUser.role}
                        </div>
                      </div>

                      <div style={{ fontSize: "20px", color: "#888" }}>
                        - {i === 0 ? "Host" : "Guest"}
                      </div>
                    </div>
                  </List.Item>
                );
              }}
              locale={{ emptyText: "Кімната порожня" }}
            />
          </Space>
        </Card>
      </Spin>
    </>
  );
}
