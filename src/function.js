import { io } from "socket.io-client";
import { notification, Space, Button } from "antd";
import axios from "axios";
import Cookies from "js-cookie";

const socket = io(`http://localhost:${process.env.PORT || 5000}`, {
  autoConnect: false,
});

export { socket };

export function createNotification(
  message,
  title,
  type = "info",
  userId,
  url = "",
  access = ""
) {
  axios
    .post("/notification", { message, title, type, userId, url, access })
    .then((response) => {
      console.log("Notification sent:", response.data);
    })
    .catch((error) => {
      console.error("Error sending notification:", error);
    });
}

export function deleteNotification(notificationId) {
  axios
    .delete(`/notification/${notificationId}`)
    .then((response) => {
      console.log("Notification deleted:", response.data);
    })
    .catch((error) => {
      console.error("Error deleting notification:", notificationId, error);
    });
}

export function setInvitedRoomId(roomId) {
  Cookies.set("roomId", roomId, { expires: 0.10 });
  socket.disconnect(); //Disconnect from previous room
  window.location.href = `/workoutroom/${roomId}`;
}

export function Notification(
  message,
  title,
  type = "info",
  notificationId = "",
  roomId = ""
) {
  const key = `open${Date.now()}`;

  const body = (
    <Space>
      <Button
        type="link"
        size="small"
        onClick={() => deleteNotification(notificationId)}
      >
        Destroy All
      </Button>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          setInvitedRoomId(roomId);
          deleteNotification(notificationId);
        }}
      >
        Confirm
      </Button>
    </Space>
  );

  notification[type]({
    message: title,
    description: message,
    key,
    duration: 7,
    ...(roomId ? {} : { btn: body }),
  });
}

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  
  return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
    sec < 10 ? "0" : ""
  }${sec}`;
};

export const timeString = (time) => {
  const date = new Date(time);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};