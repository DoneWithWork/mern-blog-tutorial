import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { errorHandler } from "../utils/Error.js";
import jwt from "jsonwebtoken";
export const signup = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "Please fill all fields"));
  }

  //duplicate user
  const user = await User.findOne({ email, username });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();
  if (!newUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  res.status(201).json({ message: "User created" });
});
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || username === "" || password === "") {
    next(errorHandler(400, "Please fill all fields"));
  }
  try {
    const validUser = await User.findOne({ username });

    if (!validUser) {
      return next(errorHandler(404, "user not found"));
    }

    const validPassword = bcrypt.compare(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(404, "Invalid credentials"));
    }

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
