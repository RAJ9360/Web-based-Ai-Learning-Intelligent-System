import "dotenv/config";   // ✅ Load environment variables FIRST

import express from "express";
import cors from "cors";

// ================= ROUTES =================
import quizRoutes from "./routes/quizRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// ================= DATABASE =================
import db from "./config/db.js";

const app = express();

// ❌ REMOVE db();  (DO NOT CALL IT)

// ================= DEBUG =================
console.log(
  "GROQ_API_KEY Loaded?:",
  process.env.GROQ_API_KEY ? "YES ✅" : "NO ❌"
);

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ================= API ROUTES =================
app.use("/api/quizzes", quizRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/auth", authRoutes);

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});