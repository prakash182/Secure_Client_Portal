// Load environment variables
require("dotenv").config();

// Imports
const express = require("express");
const cors = require("cors");

// Database
const db = require("./config/db");

// Initialize app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // For JSON body
app.use(express.urlencoded({ extended: true }));

// Test Route (Health Check)
app.get("/", (req, res) => {
  res.send("✅ Secure Client Portal API Running");
});

// Example Auth Routes (Future)
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Example Document Routes (Future)
const documentRoutes = require("./routes/document.routes");
app.use("/api/documents", documentRoutes);

// Global Error Handler (Important)
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});