const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔥 important security improvement
    },

    role: {
      type: String,
      enum: ["admin", "employee", "client"],
      default: "client",
    },

    isVerified: {
      type: Boolean,
      default: false, // future email verification ke liye
    },

    isActive: {
      type: Boolean,
      default: true, // account disable karne ke liye
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);