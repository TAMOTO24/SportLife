const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");

// const Email = require("../models/email");
const User = require("../models/user");
const Post = require("../models/post");
const Workouts = require("../models/workouts");
// const Item = require("../models/items");

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public', {
  maxAge: '1y',
  immutable: true
}));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/server-savings/"); //null - if error, "./server-savings/" - where to save files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //null - if error, Date.now() - unique name, path.extname - file extension
  },
});

const upload = multer({
  storage: storage, //Set current storage rules
  limits: {
    fileSize: 10 * 1024 * 1024, // Max size 10 MB
  },
});

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
    const userbyid = await User.findOne({_id: id}).select('-password');
    console.log("awdawd", userbyid);
    if (!userbyid) {
      return res.status(400).json({ message: "There are no account with such id!" });
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
app.post("/api/workouts", async (req, res) => {
  // Take all workouts from Collection
  const { type } = req.body;
  try {
    const items = await Workouts.find({ type: type });
    res.json(items);
  } catch (error) {
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

    // console.log({
    //   userId: userId,
    //   description,
    //   user: answerUser.name,
    //   username: answerUser.username,
    //   gallery: filePaths,
    // })
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

app.post("/upload", upload.array("image", 2), (req, res) => {
  //upload array of images where 2 is max value of images
  if (!req.files) {
    //check if there are no files
    return res.status(400).json({ message: "No files!" });
  }
  const filePaths = req.files.map(
    (file) => `./server-savings/${file.filename}`
  );

  res.json({ filePaths });
});

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
  const { username, name, lastname, email, password, gender, role, phone, profile_picture } =
    req.body;
  console.log("User data:", req.body);

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
      profile_picture: profile_picture
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
app.get("/protected-route", async (req, res) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token || token === undefined || token === "null") {
    return res.status(500).json({ message: "Ur not logined yet" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findOne({ _id: userId }).select('-password');

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/index.html"));
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
