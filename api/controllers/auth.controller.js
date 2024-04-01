import User from "../models/user.model.js";
import bcrypt from "bcrypt";
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
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
};
export const login = async (req, res) => {};
