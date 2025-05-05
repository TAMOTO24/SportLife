import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../function.js";
import axios from "axios";
import { Spin } from "antd";
import { v4 as uuidv4 } from 'uuid';

export default function RoomPage() {
  const uniqueUIDV4Id = uuidv4();
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const [messages, setMessages] = useState([]);
  console.log("userId", user);

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
    socket.connect();

    socket.emit("joinRoom", { uniqueUIDV4Id, userId: user._id });

    socket.on("receiveUpdate", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveUpdate");
      socket.disconnect();
    };
  }, [uniqueUIDV4Id]);

  const sendUpdate = () => {
    socket.emit("sendUpdate", {
      uniqueUIDV4Id,
      data: `Привіт з кімнати ${uniqueUIDV4Id} від ${user._id}`,
    });
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
