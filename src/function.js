import { io } from 'socket.io-client';

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
};