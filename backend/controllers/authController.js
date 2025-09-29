import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (u) =>
  jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });

export const register = async (req, res) => {
  const { name, email, password, role = "driver" } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email in use" });
  const passwordHash = await User.hashPassword(password);
  const user = await User.create({ name, email, role, passwordHash });
  return res.status(201).json({ user: { id: user._id, name, email, role }, token: signToken(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  user.lastLoginAt = new Date();
  await user.save();
  return res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token: signToken(user),
  });
};
