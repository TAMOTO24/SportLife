import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../function.js";
import axios from "axios";
import { Spin } from "antd";
import { v4 as uuidv4 } from "uuid";

export default function RoomPage() {
  const [uniqueUIDV4Id] = useState("74ae1ee7-7f0b-476d-93e8-f9975b494b72");
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);

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

    socket.on('chatHistory', (history) => {
      setMessages(history);
    });

    socket.on("receiveUpdate", (data) => {
      console.log("Received update:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
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
        data: `Привіт з кімнати ${uniqueUIDV4Id} від ${user._id}`,
      });
    } else {
      console.error("❌ Socket is not connected");
    }
  };

  return (
    <Spin spinning={loading}>
      <div>
        <h2>Кімната: {uniqueUIDV4Id}</h2>
        <button onClick={sendUpdate}>Надіслати повідомлення</button>
        <ul>
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    </Spin>
  );
}
