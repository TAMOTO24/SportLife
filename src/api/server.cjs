const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const multer = require("multer");
const cors = require("cors");


// const Email = require("../models/email");
const User = require("../models/user");
const Post = require("../models/post");
const Workouts = require("../models/workouts");
const Trainers = require("../models/trainers")
// const Item = require("../models/items");

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
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ["GET", "POST"]
  }
});
const roomMessages = {};

io.on('connection', socket => {
  console.log('Клієнт підключився по SocketID:', socket.id);

  socket.on('joinRoom', ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`🧍‍♂️ ${userId} приєднався до кімнати ${roomId}`);

    const history = roomMessages[roomId] || [];
    socket.emit('chatHistory', history);
  });

  socket.on('sendUpdate', ({ roomId, data }) => {
    if (!roomMessages[roomId]) roomMessages[roomId] = [];
    roomMessages[roomId].push(data);

    io.to(roomId).emit('receiveUpdate', data);
  });

  socket.on('disconnect', () => {

    console.log('Клієнт відключився:', socket.id);
  });
});

server.on("error", (err) => {
  console.error("❗ HTTP server error:", err);
});


// TODO: Delete all multer functionality. 
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./public/server-savings/"); //null - if error, "./server-savings/" - where to save files
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); //null - if error, Date.now() - unique name, path.extname - file extension
//   },
// });

// const upload = multer({
//   storage: storage, //Set current storage rules
//   limits: {
//     fileSize: 10 * 1024 * 1024, // Max size 10 MB
//   },
// });

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connecting to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

app.get("/api/items", async (req, res) => {
  // Take all items from member Collection
  try {
    const items = await User.find();
    res.json(items);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
app.post("/userbyid", async (req, res) => {
  const { id } = req.body;

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
    return res.status(400).json({ message: "User ID and Post ID are required" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const likes = post.like || [];

    if (post.like.includes(userid)) {
      post.like = likes.filter(uid => uid !== userid);
    } else {
      post.like.push(userid);
    }

    await post.save();
    res.json({ message: "Post liked/unliked successfully", likeCount: post.like.length });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
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

// app.post("/upload", upload.array("image", 2), (req, res) => {
//   if (!req.files) {
//     return res.status(400).json({ message: "No files!" });
//   }

//   const filePaths = Array.isArray(req.files)
//     ? req.files.map((file) => `./server-savings/${file.filename}`)
//     : [`./server-savings/${req.files.filename}`];
//   res.json({ filePaths });
// });

app.get("/api/getposts", async (req, res) => {
  try {
    const post = await Post.find();
    res.json(post);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "client/build")));

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
