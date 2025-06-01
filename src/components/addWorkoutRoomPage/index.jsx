import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../function.js";
import axios from "axios";
import { List, message, Button, Spin } from "antd";
import { useNavigate, useLocation, Link } from "react-router-dom";
// import { v4 as uuidv4 } from "uuid";
import { createNotification } from "../../function.js";
// import Cookies from "js-cookie";
import InviteUser from "../addInviteUserElement/index.jsx";
import "./style.css";

export default function RoomPage() {
  const location = useLocation();
  const [uniqueUIDV4Id] = useState(useParams().roomId);
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { workouts } = location.state || {};

  const [users, setUsers] = useState([]);
  // const [data, setData] = useState({});
  const [isOwner, setOwner] = useState(false);

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
      console.log("Room owner changed", ownerId === user._id, ownerId, user._id)
      setOwner(ownerId === user._id);
    });

    // socket.on("receiveUpdate", (data) => {
    //   setData(data);
    // });

    socket.on("redirect", () => {
      console.log("Redirect");
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
      // socket.emit("disconnectData", {
      //   roomId: uniqueUIDV4Id,
      //   userId: user._id,
      // });
      // socket.disconnect();
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
      // Cookies.remove("roomId");
      navigate("/", { replace: true });
      console.log("Socket disconnected");
      socket.disconnect();
    } else {
      console.error("❌ Socket is not connected");
    }
  };

  return (
    <div className="room-page">
      <Spin spinning={loading} tip="Loading">
        <h2>Створення кімнати</h2>
        {isOwner && (
          <InviteUser
            userId={user?._id}
            message={"Надіслати запрошення"}
            sendFunction={sendRequest}
          />
          // <Dropdown menu={{ items }}>
          //   <Button onClick={(e) => e.preventDefault()}>
          //
          //   </Button>
          // </Dropdown>
        )}
        <button
          onClick={() => {
            disconnectSocket();
            navigate("/", { replace: true });
            //  <Navigate to={"/"} replace/>
          }}
        >
          Відключитися
        </button>
        {isOwner && (
          <Link
            to={`/workoutprogress/${uniqueUIDV4Id}`}
            state={{ currentWorkout: workouts }}
          >
            <Button
              onClick={() => {
                socket.emit("redirectAll", { roomId: uniqueUIDV4Id });
              }}
            >
              Почати тренування
            </Button>
          </Link>
        )}
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
