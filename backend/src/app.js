require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Allowed origins: local dev + Vercel production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  // Production Vercel URL - env dan olinadi
  process.env.FRONTEND_URL,
].filter(Boolean);

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Postman / server-to-server (origin yo'q) - ruxsat
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        // Vercel preview URL larini ham qabul qilish
        /\.vercel\.app$/.test(origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS: ruxsat yo'q - " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server ishlayapti" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: "Bu sahifa topilmadi",
  });
});

// Global Error Handler
app.use(errorHandler);

// MongoDB ga ulanish va serverni ishga tushirish
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB ga muvaffaqiyatli ulandi");
    app.listen(PORT, () => {
      console.log(`🚀 Server http://localhost:${PORT} da ishlamoqda`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB ga ulanishda xato:", err.message);
    process.exit(1);
  });

module.exports = app;
