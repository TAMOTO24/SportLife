const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { PeerServer } = require("peer");

const User = require("../models/user");
const Room = require("../models/room");
const Chats = require("../models/chats");

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(
  express.static("public", {
    maxAge: "1y",
    immutable: true,
  })
);
app.use(require("./routes/auth.cjs"));
app.use(require("./routes/users.cjs"));
app.use(require("./routes/trainers.js"));
app.use(require("./routes/posts.js"));
app.use(require("./routes/requests.js"));
app.use(require("./routes/bookmarks.js"));
app.use(require("./routes/notifications.js"));
app.use(require("./routes/subscriptions.js"));
app.use(require("./routes/chats.js"));
app.use(require("./routes/rooms.js"));
app.use(require("./routes/workouts.js"));

const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

PeerServer({
  port: 9000,
  path: "/peerjs",
  corsOptions: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  let currentHostId = null;
  const getRoomUserCount = (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    return room ? room.size : 0;
  };

  socket.on("join_chat", async ({ userId, chatId }) => {
    const room = `chat_${chatId}`;
    socket.join(room);

    const chatfilter = await Chats.findById(chatId);

    io.to(room).emit("change_chat", chatfilter);
    console.log(`User ${userId} joined ${room}`);
  });

  socket.on("new_chat", async ({ firstUser, secondUser, oldId }) => {
    try {
      const chatfilter = await Chats.findOne({
        chating: { $all: [firstUser, secondUser] },
      });

      if (chatfilter) return;

      if (oldId) socket.leave(`chat_${oldId}`);
      console.log(`Leaving room: ${oldId}`);

      const chat = new Chats({
        history: [],
        chating: [firstUser, secondUser],
      });

      if (oldId) socket.join(`chat_${chat?._id}`);
      console.log(`Joining room: ${chat?._id}`);

      const first = await User.findById(firstUser);
      const second = await User.findById(secondUser);

      if (!first.chats) first.chats = [];
      if (!second.chats) second.chats = [];

      if (!first.chats.some((user) => user.id === second._id)) {
        first.chats.push(secondUser);
      }

      if (!second.chats.some((user) => user.id === first._id)) {
        second.chats.push(firstUser);
      }

      await first.save();
      await second.save();
      await chat.save();
      socket.emit("update_chats", { newChat: chat });
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  });
  socket.on("recconnect", ({ old, newRoom }) => {
    if (old) {
      socket.leave(`chat_${old}`);
    }

    if (newRoom) {
      socket.join(`chat_${newRoom}`);
    }
  });

  socket.on("send_message", async ({ chatId, message, date, fromId }) => {
    const room = `chat_${chatId}`;
    const newMessage = { date, fromId, message };

    io.to(room).emit("receive_message", newMessage);
  });

  socket.on("save_chat", async ({ message, date, fromId, chatId }) => {
    try {
      if (!chatId || !message || !fromId || !date) {
        console.error("Недійсні дані для збереження повідомлення");
        return;
      }

      const newMessage = { message, date, fromId };

      const updated = await Chats.findByIdAndUpdate(
        chatId,
        { $push: { history: newMessage } },
        { new: true }
      );

      if (!updated) {
        console.error(`Чат з ID ${chatId} не знайдено`);
      }

      console.log("Повідомлення додано до історії:", newMessage);
      io.to(`chat_${chatId}`).emit("receive_message", newMessage);
    } catch (error) {
      console.error("Помилка при збереженні повідомлення:", error);
    }
  });

  socket.on("join-stream", ({ roomId, userId }) => {
    socket.to(roomId).emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    });
  });
  socket.on("request-host", () => {
    if (currentHostId) {
      socket.emit("host-available", currentHostId);
    }
  });
  socket.on("host-available", (hostPeerId) => {
    currentHostId = hostPeerId;
    socket.broadcast.emit("host-available", hostPeerId);
  });
  socket.on("joinRoom", async ({ roomId, userId, peerId }) => {
    socket.join(roomId);
    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) {
      const newRoom = new Room({
        roomId: roomId,
        createdAt: new Date(),
        data: { "": "1" },
        users: [userId],
        owner: userId,
      });
      await newRoom.save();

      const count = getRoomUserCount(roomId);
      io.to(roomId).emit("room-user-count", count);
      io.to(newRoom.roomId).emit("chatHistory", newRoom.users);
      io.to(newRoom.roomId).emit("roomOwner", newRoom.owner);
      socket.emit("receiveData", newRoom.data);
    } else {
      if (!existingRoom.users.includes(userId)) {
        existingRoom.users.push(userId);
        await existingRoom.save();
      }

      io.to(existingRoom.roomId).emit("chatHistory", existingRoom.users);
      io.to(existingRoom.roomId).emit("roomOwner", existingRoom.owner);
      socket.emit("receiveData", existingRoom.data);
    }
  });

  socket.on("getAllRoomUsers", async ({ roomId }) => {
    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) return;

    io.to(roomId).emit("chatHistory", existingRoom.users);
    io.to(roomId).emit("roomOwner", existingRoom.owner);
  });

  socket.on("hostChangedPage", ({ roomId }) => {
    socket.broadcast.to(roomId).emit("backToRoom");
  });

  socket.on("update-camera-status", async ({ roomId, status }) => {
    const existingRoom = await Room.findOne({ roomId });

    if (existingRoom?.data && status !== undefined) {
      existingRoom.data.cameraStatus = status;
      existingRoom.markModified("data");
      await existingRoom.save();

      io.to(roomId).emit("camera-status-updated", status);
    }
  });

  socket.on("getRoomOwner", async ({ roomId }) => {
    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) return;

    io.to(roomId).emit("roomOwner", existingRoom.owner);
  });

  socket.on("sendUpdate", async ({ roomId, data }) => {
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      existingRoom.data = data;
      await existingRoom.save();
    }

    const count = getRoomUserCount(roomId);
    io.to(roomId).emit("room-user-count", count);
    io.to(roomId).to(roomId).emit("receiveUpdate", data);
  });

  socket.on(
    "updateData",
    async ({
      roomId,
      userId,
      data,
      currentWorkout,
      startTime = null,
      finalTimeResult = null,
      status,
    }) => {
      const existingRoom = await Room.findOne({ roomId });

      if (!existingRoom || !data) return;

      if (!existingRoom.owner.toString() === userId) {
        return;
      }

      existingRoom.data["exercises"] = data;
      existingRoom.data["startTime"] = startTime;
      existingRoom.data["finalTimeResult"] = finalTimeResult;
      existingRoom.data["status"] = status;
      existingRoom.data["currentWorkout"] = currentWorkout;
      existingRoom.markModified("data");
      await existingRoom.save();

      const count = getRoomUserCount(roomId);
      io.to(roomId).emit("room-user-count", count);
      io.to(roomId).emit("receiveData", existingRoom.data);
    }
  );

  socket.on("redirectAll", ({ roomId }) => {
    socket.to(roomId).emit("redirect");
  });

  socket.on("disconnectData", async ({ roomId, userId }) => {
    console.log("roomId", roomId);
    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) return;
    if (!existingRoom.roomId) return;

    if (existingRoom.owner.toString() === userId) {

      socket.broadcast.to(roomId).emit("roomClosed");
      return;
    }

    const updatedRoom = await Room.findOne({ roomId });
    if (!updatedRoom) return;

    existingRoom.users = existingRoom.users.filter((user) => user !== userId);
    await existingRoom.save();

    const count = getRoomUserCount(roomId);
    io.to(roomId).emit("room-user-count", count);

    io.to(roomId).emit("chatHistory", existingRoom.users);

    const room = io.sockets.adapter.rooms.get(roomId);
    const numClients = room ? room.size : 0;
    if (existingRoom.users.length === 0 || numClients === 0) {
      try {
        await Room.deleteOne({ roomId });
      } catch (err) {
        console.error("Ошибка при удалении комнаты:", err);
      }
    }
    // * find and delete user from room if he disconnected
  });

  socket.on("updateUsersStatistic", async ({ userId, data }) => {
    if (!userId) return;
    const user = await User.findById(userId);

    if (!data || !user) {
      return;
    }
    if (!Array.isArray(user.statistic)) {
      user.statistic = [];
    }

    user.statistic.push(data);
    user.save();
  });

  // socket.on("clearEmptyRoom", async ({ roomId, userId }) => {
  //   if (roomId) {
  //     const room = await Room.findOne({ roomId });

  //     if (room && room.owner.toString() === userId) {
  //       await Room.deleteOne({ roomId });
  //       socket.broadcast.to(roomId).emit("roomClosed");
  //     }
  //   }
  // });

  socket.on("disconnect", () => {
    console.log("Клієнт відключився:", socket.id);
  });
});

server.on("error", (err) => {
  console.error("❗ HTTP server error:", err);
});

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connecting to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});
const PORT = process.env.SERVER_PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
