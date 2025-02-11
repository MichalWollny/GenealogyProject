import User from "../models/userSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import { sessionWithTransaction } from "../utils/sessionWithTransaction.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER PART
export const signUp = sessionWithTransaction(
  async (req, res, next, session) => {
    const { username, firstName, lastName, password } = req.body;

    if (!username || !firstName || !lastName || !password) {
      throw new ErrorResponse("All fields are required", 400);
    }

    const existingUser = await User.findOne({ username }).session(session);
    if (existingUser) {
      throw new ErrorResponse("User already exists", 400);
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      firstName,
      lastName,
      password: hash,
    });
    await newUser.save({ session });

    const token = jwt.sign({ uid: newUser._id }, process.env.JWT_SECRET);
    res.status(201).json({
      message: `User: ${newUser.username} has been created successfully!`,
      token,
    });
  }
);

//LOGIN PART
export const signIn = sessionWithTransaction(
  async (req, res, next, session) => {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new ErrorResponse(
        "Both Username and Password are required to login!",
        400
      );
    }

    const existingUser = await User.findOne({ username }).select("+password");
    if (!existingUser) {
      throw new ErrorResponse("User not found", 404);
    }

    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      throw new ErrorResponse("Password is incorrect", 401);
    }

    existingUser.lastLogin = new Date();
    await existingUser.save({ session });

    const token = jwt.sign({ uid: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "120m",
    });

    res.cookie("token", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      message: `${existingUser.username} has logged in successfully`,
    });
  }
);

// VERIFY USER PART
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.uid);
  res.json(user);
});

// LOGOUT PART
export const logout = asyncHandler(async (req, res, next) => {
  // console.log('Logging out user');
  res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
  // console.log('Cookie cleared');
  res.send({ message: `Successfully logged out!`, status: "success" });
});
