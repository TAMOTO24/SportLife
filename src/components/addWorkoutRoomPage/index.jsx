import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../function.js";
import axios from "axios";
import { Avatar, List, message, Dropdown, Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
import { createNotification } from "../../function.js";
import Cookies from "js-cookie";
import "./style.css";

export default function RoomPage() {
  const [uniqueUIDV4Id] = useState(useParams().roomId);
  const [user, setUser] = useState(undefined);
  const [allUsers, setAllusers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({});
  const [isOwner, setOwner] = useState(false);

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
    }

    socket.on("connect", async () => {
      console.log("✅ Connected to socket.io server:", socket.id);

      socket.emit("joinRoom", { roomId: uniqueUIDV4Id, userId: user._id });
      socket.emit("getRoomOwner", { roomId: uniqueUIDV4Id });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket.io connection error:", err.message);
    });

    socket.on("roomClosed", () => {
      console.log("⚠️ Room was closed by owner");
      message.error("Кімнату закрито — творець вийшов");
      navigate("/");
    });

    socket.on("chatHistory", (user) => {
      setUsers(user);
    });

    socket.on("roomOwner", (ownerId) => {
      setOwner(ownerId === user._id);
      console.log("Room owner ID:", ownerId === user._id);
    });

    socket.on("receiveUpdate", (data) => {
      setData(data);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("chatHistory");
      socket.off("roomOwner");
      socket.off("receiveUpdate");
      socket.disconnect();
    };
  }, [user, uniqueUIDV4Id]);

  const items = allUsers
    .filter((i) => i?._id !== user?._id)
    .map((i) => ({
      key: i?._id,
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "100%",
          }}
          onClick={() => sendRequest(i?._id)}
        >
          <Avatar
            size={60}
            src={i?.profile_picture || "/img-pack/icons/user-blacktheme.png"}
          />
          <div>
            <strong>
              {i?.name} {i?.last_name || ""}
            </strong>
            <div style={{ fontSize: "12px", color: "#888" }}>{i?.role}</div>
          </div>
        </div>
      ),
    }));

  const sendRequest = (id) => {
    createNotification(
      "Запрошення на приєднання до кімнати",
      "Запрошення на приєднання до кімнати",
      "info",
      id,
      uniqueUIDV4Id
    );
    message.success("Запрошення надіслано!");
  };
  const disconnectSocket = () => {
    if (socket.connected) {
      socket.emit("disconnectData", {
        roomId: uniqueUIDV4Id,
        userId: user._id,
      });
      Cookies.remove("roomId");
      navigate("/");
      console.log("Socket disconnected");
    } else {
      console.error("❌ Socket is not connected");
    }
  };
  // TODO MAKE INVITE FRIENDS FUNCTIONALITY
  return (
    <div className="room-page">
      <Spin spinning={loading} tip="Loading">
        <h2>Створення кімнати</h2>
        {isOwner && (
          <Dropdown menu={{ items }}>
            <Button onClick={(e) => e.preventDefault()}>
              Надіслати запрошення
            </Button>
          </Dropdown>
        )}
        <button
          onClick={() => {
            disconnectSocket();
            navigate("/");
          }}
        >
          Відключитися
        </button>
        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={users}
          // renderItem={(item) => (
          //   <List.Item
          //     actions={[
          //       <a key="list-loadmore-edit">edit</a>,
          //       <a key="list-loadmore-more">more</a>,
          //     ]}
          //   >
          //     <Skeleton avatar title={false} loading={item.loading} active>
          //       <List.Item.Meta
          //         avatar={<Avatar src={item.avatar} />}
          //         title={<a href="https://ant.design">{item.name}</a>}
          //         description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          //       />
          //       <div>content</div>
          //     </Skeleton>
          //   </List.Item>
          // )}
        />
        <ul>
          Люди в кімнаті:
          {users.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </Spin>
    </div>
  );
}
