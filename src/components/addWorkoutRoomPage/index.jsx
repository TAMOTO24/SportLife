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
} from "antd";
import { Typography } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createNotification } from "../../function.js";
import InviteUser from "../addInviteUserElement/index.jsx";
import "./style.css";

const { Title, Text } = Typography;

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
    if (!user) return;

    if (!socket.connected) {
      socket.connect();
    } else {
      socket.emit("getAllRoomUsers", { roomId: uniqueUIDV4Id });
    }

    socket.on("connect", async () => {
      socket.emit("joinRoom", { roomId: uniqueUIDV4Id, userId: user._id });
      socket.emit("getRoomOwner", { roomId: uniqueUIDV4Id });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket.io connection error:", err.message);
    });

    socket.on("roomClosed", () => {
      message.error("Кімнату закрито — творець вийшов");
      // Cookies.remove("roomId");
      navigate("/", { replace: true });
    });

    socket.on("chatHistory", (user) => {
      setUsers(user);
    });

    socket.on("roomOwner", (ownerId) => {
      setOwner(ownerId === user._id);
    });

    // socket.on("receiveUpdate", (data) => {
    //   setData(data);
    // });

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
      console.log("U left the room or smth went wrong");
      //! This code can contain bugs
      socket.emit("clearEmptyRoom", {
        roomId: uniqueUIDV4Id,
        userId: user._id,
      });
      setTimeout(() => {
        socket.disconnect();
      }, 500);
    };
  }, [user, uniqueUIDV4Id, navigate, location]);

  const sendRequest = (id) => {
    // ! TEST THIS CODE UP - it can contain an error
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

  console.log(workouts?.img
              ? `url(${workouts.img[0]})`
              : "/img-pack/page1.jpg",)

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
            </Space>

            {isOwner && (
              <Link
                to={`/workoutprogress/${uniqueUIDV4Id}`}
                state={{ currentWorkout: workouts }}
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
