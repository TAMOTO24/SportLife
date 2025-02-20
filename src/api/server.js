import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Item from "../models/items.js";
import Email from "../models/email.js";

dotenv.config();
const app = express();
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connecting to MongoDB"))
  .catch(err => console.error("❌ Connection error:", err));

app.get("/api/items", async (req, res) => {// Take all items from member Collection
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).send("Ошибка сервера");
  }
});
app.get("/api/email", async (req, res) => {
  try {
    const email = await Email.find();
    res.json(email);
  } catch (error) {
    res.status(500).send("Ошибка сервера");
  }
});

// Раздача статического фронта
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));