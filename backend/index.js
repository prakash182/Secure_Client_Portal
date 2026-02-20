// ===============================
// Load Environment Variables
// ===============================
require("dotenv").config();

// ===============================
// Imports
// ===============================
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// ===============================
// Database
// ===============================
const db = require("./config/db");

// ===============================
// Initialize App
// ===============================
const app = express();

// ===============================
// Security & Performance Middlewares
// ===============================

// Secure HTTP Headers
app.use(helmet());

// Rate Limiter (Prevent Abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests per IP
});
app.use(limiter);

// Logger (Dev Only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// CORS
app.use(cors());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Static File Access (Uploads)
// ===============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===============================
// Health Check
// ===============================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "✅ Secure Client Portal API Running",
    timestamp: new Date(),
  });
});

// ===============================
// Database Health Check
// ===============================
app.get("/health/db", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        db: "DOWN",
        error: err.message,
      });
    }

    res.json({
      success: true,
      db: "UP",
    });
  });
});

// ===============================
// Routes
// ===============================

// Auth Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Document Routes
const documentRoutes = require("./routes/documentRoutes");
app.use("/api/documents", documentRoutes);

// ===============================
// 404 Handler (Not Found)
// ===============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ===============================
// Global Error Handler
// ===============================
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ===============================
// Server Start
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 Server Started Successfully");
  console.log(`🌐 Port: ${PORT}`);
  console.log(`📁 Uploads: /uploads`);
  console.log(`🛢️  DB: ${process.env.DB_NAME}`);
  console.log("=================================");
});