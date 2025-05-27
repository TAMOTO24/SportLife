const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { PeerServer } = require("peer");

const User = require("../models/user");
const Post = require("../models/post");
const Workouts = require("../models/workouts");
const Trainers = require("../models/trainers");
const Room = require("../models/room");
const Request = require("../models/requests");
const Exercises = require("../models/exercises");
const Notification = require("../models/notifications");

dotenv.config();
const app = express();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(
  express.static("public", {
    maxAge: "1y",
    immutable: true,
  })
);
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

      io.emit("chatHistory", newRoom.users);
      io.emit("roomOwner", newRoom.owner);
    } else {
      const userExists = existingRoom.users.includes(userId);
      if (userExists) {
        // check if user already exists u can't add empty user or smth that don't exist
        if (!existingRoom.users.includes(userId)) {
          existingRoom.users.push(userId);
          await existingRoom.save();
        }
      } else return;

      io.emit("chatHistory", existingRoom.users);
      io.emit("roomOwner", existingRoom.owner);
      socket.emit("receiveData", existingRoom.data);
    }
  });

  socket.on("getAllRoomUsers", async ({ roomId }) => {
    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) return;

    io.emit("chatHistory", existingRoom.users);
    io.emit("roomOwner", existingRoom.owner);
  });

  socket.on("getRoomOwner", async ({ roomId }) => {
    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) return;

    io.emit("roomOwner", existingRoom.owner);
  });

  socket.on("sendUpdate", async ({ roomId, data }) => {
    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      existingRoom.data = data;
      await existingRoom.save();
    }
    io.to(roomId).emit("receiveUpdate", data);
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

      io.to(roomId).emit("receiveData", existingRoom.data);
    }
  );

  socket.on("redirectAll", ({ roomId }) => {
    socket.to(roomId).emit("redirect");
  });

  socket.on("disconnectData", async ({ roomId, userId }) => {
    const existingRoom = await Room.findOne({ roomId });

    if (!existingRoom) return;

    if (existingRoom.owner.toString() === userId) {
      await Room.deleteOne({ roomId });

      console.log("owner disconnected, room deleted");

      socket.to(roomId).emit("roomClosed");
      return;
    }

    existingRoom.users = existingRoom.users.filter((user) => user !== userId);
    await existingRoom.save();

    io.emit("chatHistory", existingRoom.users);

    if (existingRoom.users.length === 0) {
      await Room.deleteOne({ roomId });
    }
    // * find and delete user from room if he disconnected
  });

  socket.on("updateUsersStatistic", async ({ userId, data }) => {
    const user = await User.findById(userId);
    //FIX THIS SOCKET METHOD, DIDN'T SAVE THE RESULT

    console.log("start");

    if (!userId || !data || !user) {
      return;
    }
    if (!Array.isArray(user.statistic)) {
      user.statistic = [];
    }

    console.log("end");

    user.statistic.push(data);
    console.log("result", user.statistic);
    user.save();
  });

  socket.on("disconnect", () => {
    // console.log("Клієнт відключився:", socket.id);
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

app.get("/allusers", async (req, res) => {
  // Take all items from member Collection
  try {
    const items = await User.find();
    res.json(items);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
app.get("/room/:id", async (req, res) => {
  const { id } = req.params;

  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).json({ message: "Invalid room ID format!" });
  // }
  try {
    const room = await Room.findOne({ roomId: id });
    if (!room) {
      return res
        .status(400)
        .json({ message: "There are no room with such id!" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).send(`Server error ${error}`);
  }
});
app.get("/userbyid/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID format!" });
  }
  try {
    const userbyid = await User.findOne({ _id: id }).select("-password");
    if (!userbyid) {
      return res
        .status(400)
        .json({ message: "There are no account with such id!" });
    }
    res.json(userbyid);
  } catch (error) {
    res.status(500).send(`Server error ${error}`);
  }
});
app.get("/api/email", async (req, res) => {
  // Take all emails from member Collection
  try {
    const email = await User.find();
    res.json(email);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
app.get("/trainers", async (req, res) => {
  // Take all trainers data from member Collection
  try {
    const trainers = await Trainers.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
app.get("/api/workouts/:type", async (req, res) => {
  const { type } = req.params;
  try {
    const items = await Workouts.find({ type });
    res.json(items);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.put("/api/like", async (req, res) => {
  const { userid, id } = req.body;

  if (!userid || !id) {
    return res
      .status(400)
      .json({ message: "User ID and Post ID are required" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likes = post.like || [];

    if (post.like.includes(userid)) {
      post.like = likes.filter((uid) => uid !== userid);
    } else {
      post.like.push(userid);
    }

    await post.save();
    res.json({
      message: "Post liked/unliked successfully",
      likeCount: post.like.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/exercises/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const exercises = await Exercises.findById(id);

  if (!exercises) {
    return res
      .status(500)
      .json({ message: "There are no such exercises by that id" });
  }
  res.json(exercises);
});

app.post("/createpagepost", async (req, res) => {
  const { filePaths, description } = req.body; //Take data post img paths and description

  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", ""); //Verify user JWT token

  if (!token || token === undefined || token === "null") {
    return res.status(500).json({ message: "Ur not logined yet" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; // Decode tokin to get user id from it

    const answerUser = await User.findOne({ _id: userId }); //Find user by id

    const newPost = new Post({
      userId: userId,
      text: description,
      user: answerUser.name || "",
      username: answerUser.username,
      gallery: filePaths,
      userIcon: answerUser.icon || "",
    });
    await newPost.save();
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/getposts", async (req, res) => {
  try {
    const post = await Post.find();
    res.json(post);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.post("/newuser", async (req, res) => {
  const {
    username,
    name,
    lastname,
    email,
    password,
    gender,
    role,
    phone,
    profile_picture,
  } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if data already exists
    const existingEmail = await User.findOne({ email });
    const existingUser = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create a new user
    const newUser = new User({
      username: username,
      name: name,
      last_name: lastname,
      email: email,
      password: hashedPassword,
      gender: gender,
      role: role,
      phone: phone,
      profile_picture: profile_picture,
    });
    await newUser.save();

    //  Create JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ token });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "There is no such email, register first!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      //Compare passwords
      return res.status(400).json({ message: "Invalid password try again!" });
    }

    //Create JWT token with special hex code
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: false,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    //Return Tokin
    res.json({ token });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/currentuserdata", async (req, res) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token || token === undefined || token === "null") {
    return res.status(500).json({ message: "Ur not logined yet" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findOne({ _id: userId }).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "There is no such email, register first!" });
    }

    res.json({ message: "Access given", user });
  } catch (error) {
    return res.status(401).json({ message: "Token error" });
  }
});

app.post("/notification", async (req, res) => {
  const { access, title, message, userId, url, type } = req.body;

  const newNotification = new Notification({
    access: access === "all" ? "all" : userId,
    title,
    date: new Date(),
    message,
    url,
    type,
    readStatus: [],
  });
  await newNotification.save();

  res
    .status(201)
    .json({ message: "Notification created successfully", newNotification });
});

app.delete("/notification/:notificationId", async (req, res) => {
  const { notificationId } = req.params;

  try {
    if (!notificationId) {
      return res.status(204).json({ message: "No Id as query" });
    }

    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/notification/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(204).json({ message: "No Id as query" });
    }

    const notifications = await Notification.findOne({
      $and: [
        { $or: [{ access: "all" }, { access: userId }] },
        { readStatus: { $nin: [userId] } },
      ],
    }).sort({ date: -1 });

    if (!notifications) {
      return res.status(204).json({ message: "No notifications found" });
    }
    if (notifications.readStatus.includes(userId)) {
      return res.status(204).json({ message: "Notification already read" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await Request.findById(id);
    if (!request) {
      return res.status(204).json({ message: "No request found" });
    }
    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/sendemail", upload.array("files"), async (req, res) => {
  const { id, email, subject, note } = req.body;
  const files = req.files;

  if (!email || !subject || !note || !id || !files || files.length === 0) {
    console.log(id, email, subject, note, files);
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const attachments = files.map((file, index) => ({
      filename: file.originalname || `file-${index}`,
      content: file.buffer,
      contentType: file.mimetype,
    }));

    console.log("Attachments:", attachments);
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sportlife.corporate.mail@gmail.com",
        pass: "fund yebs qing bmqy",
      },
    });

    let link = `http://localhost:5000/confirm-email`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Підтвердження на тему ${subject}!</h2>
        <p>Щоб підтвердити свою електронну пошту, натисніть на кнопку нижче:</p>
        <div style="display: flex; flex-direction: column; gap: 10px;">
        <a href="${link}" 
          style="display:inline-block; padding: 10px 20px; background-color: #28a745; color: white; 
                  text-decoration: none; border-radius: 5px; font-weight: bold;">
          Подтвердить по документам роль тренера
        </a>

        <a href="${link}" 
          style="display:inline-block; padding: 10px 20px; background-color:rgb(167, 40, 40); color: white; 
                  text-decoration: none; border-radius: 5px; font-weight: bold;">
          Відхилити запит на тренера
        </a>
        </div>
        <p>Якщо ви не запитували підтвердження, будь ласка, проігноруйте це повідомлення.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"SPORTLIFe" <your_email@gmail.com>`,
      to: "sportlife.corporate.mail@gmail.com",
      subject: `${subject}`,
      text: `${note}`,
      html: htmlContent,
      replyTo: email,
      attachments,
    });

    const findRequest = await Request.findOne({ userId: id });
    if (!findRequest) {
      const user = await User.findById(id);
      const newRequest = new Request({
        email: email,
        userId: user._id,
        requestReason: "trainer",
        status: "pending",
      });

      user.trainerRequestId = newRequest._id; // Save request id to user
      await user.save(); // Save user with updated request id
      await newRequest.save();
    }

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending mail" });
  }
});

app.get("/allnotifications/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      return res.status(204).json({ message: "No Id as query" });
    }
    const notifications = await Notification.find({
      $or: [{ access: "all" }, { access: userId }],
    }).sort({ date: -1 });

    if (!notifications) {
      return res.status(204).json({ message: "No notifications found" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/notification/:userId", async (req, res) => {
  const { userId } = req.params;
  const { notificationId } = req.body;

  try {
    if (!notificationId) {
      return res.status(204).json({ message: "No Id as query" });
    }

    const notification = await Notification.findOne({
      $or: [{ access: "all" }, { access: userId }],
      _id: notificationId,
    });

    if (!notification) {
      return res.status(204).json({ message: "Notification not found" });
    }
    if (notification.readStatus.includes(userId)) {
      return res.status(204).json({ message: "Notification already read" });
    }
    notification.readStatus.push(userId);
    await notification.save();

    res
      .status(200)
      .json({ message: "Notification updated successfully", notification });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/updateuser", async (req, res) => {
  try {
    const {
      id,
      username,
      name,
      lastname,
      email,
      role,
      phone,
      profileDescription,
      picture,
    } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const existingUser = await User.findById(id).select("-password");
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const [checkUsername, checkEmail, checkPhone] = await Promise.all([
      //Check user's data if it's repeats or not
      User.findOne({ username }).select("-password"),
      User.findOne({ email }).select("-password"),
      User.findOne({ phone }).select("-password"),
    ]);

    if (checkUsername && checkUsername.id !== id) {
      //check username
      return res.status(400).json({ message: "Username already exists" });
    }
    if (checkEmail && checkEmail.id !== id) {
      //check email
      return res.status(400).json({ message: "Email already exists" });
    }
    if (checkPhone && checkPhone.id !== id) {
      // check email
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      // find user by his id and update data to new that was inputed
      id,
      {
        username,
        name,
        last_name: lastname,
        email,
        role,
        phone,
        profile_picture: picture,
        profileDescription,
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});
const PORT = process.env.SERVER_PORT || 5000;
server.listen(5000, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
// app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
