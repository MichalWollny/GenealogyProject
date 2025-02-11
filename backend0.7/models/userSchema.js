import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
    },
    firstName: {
      type: String,
      requered: [true, "Firstname is required"],
    },
    lastName: {
      type: String,
      requered: [true, "Lastname is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    age: { type: Number, default: null },
    gender: {
      type: String,
      default: "",
      enum: ["", "male", "female", "other"],
    },
    avatar: {
      type: String,
      default: "",
      // to be added later
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
