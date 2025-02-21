const express = require("express");
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");


// const Email = require("../models/email");
const User = require("../models/user");
const Item = require("../models/items");

dotenv.config();
const app = express();
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connecting to MongoDB"))
  .catch(err => console.error("❌ Connection error:", err));

app.get("/api/items", async (req, res) => { // Take all items from member Collection
  try {
    const items = await User.find();
    res.json(items);
  } catch (error) {
    res.status(500).send("Ошибка сервера");
  }
});

app.get("/api/email", async (req, res) => {
  try {
    const email = await User.find();
    res.json(email);
  } catch (error) {
    res.status(500).send("Ошибка сервера");
  }
});

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "client/build")));

app.post('/api/newuser', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received username:', username);
  console.log('Received email:', email);
  console.log('Received password:', password);

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
    // Create new user with hashed password
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));

