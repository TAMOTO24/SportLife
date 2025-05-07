import { io } from "socket.io-client";
import { notification } from 'antd';

const socket = io(`http://localhost:${process.env.PORT || 5000}`, {
  autoConnect: false,
});

export { socket };

export function notificationAllUsers(message) {
  const key = `open${Date.now()}`;
  // message.open({
  //     key,
  //     type: "info",
  //     content: "User registered successfully!",
  //     duration: 2.5,
  //     onClick: () => {
  //     console.log("Notification Clicked!");
  //     },
  // });
}

export function Notification(message, title, type="info") {
  const key = `open${Date.now()}`;
  notification[type]({
    message: title,
    description: message,
    key,
    duration: 7,
  });
}
