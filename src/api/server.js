import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Item from "../models/items.js";

dotenv.config();
const app = express();
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Подключено к MongoDB"))
  .catch(err => console.error("❌ Ошибка подключения:", err));

// API роут
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).send("Ошибка сервера");
  }
});

// Раздача статического фронта
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));