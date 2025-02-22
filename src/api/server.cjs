const express = require("express");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// const Email = require("../models/email");
const User = require("../models/user");
// const Item = require("../models/items");

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json());

// Подключение к MongoDB
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

app.get("/api/email", async (req, res) => {
  try {
    const email = await User.find();
    res.json(email);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "client/build")));

app.post("/newuser", async (req, res) => {
  const { username, email, password } = req.body;
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
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    //  Create JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
        httpOnly: true,    
        secure: true,      
        sameSite: 'Strict', 
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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
        httpOnly: true,    
        secure: true,      
        sameSite: 'Strict', 
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    //Return Tokin
    res.json({ token });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
app.get("/protected-route", async (req, res) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token || token === undefined || token === "null") {
    return res.status(500).json({ message: "Ur not logined yet" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findOne({ _id: userId });

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

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
