import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../function.js";
import axios from "axios";
import { Avatar, Button, List, Skeleton, Spin } from "antd";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";

export default function RoomPage() {
  const [uniqueUIDV4Id, setUniqueUIDV4Id] = useState(uuidv4());
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    const existingRoomId = Cookies.get("roomId");
    if (!existingRoomId) {
      Cookies.set("roomId", uniqueUIDV4Id, { expires: 1 });
    } else {
      setUniqueUIDV4Id(existingRoomId);
    }
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

    socket.on("connect", () => {
      console.log("✅ Connected to socket.io server:", socket.id);

      socket.emit("joinRoom", { roomId: uniqueUIDV4Id, userId: user._id });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket.io connection error:", err.message);
    });

    socket.on("chatHistory", (user) => {
      setUsers(user);
      console.log("Chat history:", user);
    });

    socket.on("receiveUpdate", (data) => {
      setData(data);
      console.log("Chat history:", data);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("receiveUpdate");
      socket.disconnect();
    };
  }, [user]);

  const sendUpdate = () => {
    if (socket.connected) {
      socket.emit("sendUpdate", {
        roomId: uniqueUIDV4Id,
        data: {},
      });
    } else {
      console.error("❌ Socket is not connected");
    }
  };
  const disconnectSocket = () => {
    if (socket.connected) {
      socket.emit("disconnectData", {
        roomId: uniqueUIDV4Id,
        userId: user._id,
      });
      navigate("/");
      console.log("Socket disconnected");
    } else {
      console.error("❌ Socket is not connected");
    }
  };

  return (
    <div>
      <h2>Створення кімнати</h2>
      <button onClick={sendUpdate}>Надіслати повідомлення</button>
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
        renderItem={(item) => (
          <List.Item
            actions={[
              <a key="list-loadmore-edit">edit</a>,
              <a key="list-loadmore-more">more</a>,
            ]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href="https://ant.design">{item.name}</a>}
                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
              />
              <div>content</div>
            </Skeleton>
          </List.Item>
        )}
      />
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
