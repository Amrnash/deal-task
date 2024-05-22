import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "CLIENT", "AGENT"],
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "DELETED"],
    required: true,
    default: "ACTIVE",
  },
});

export const User = mongoose.model("User", userSchema);
