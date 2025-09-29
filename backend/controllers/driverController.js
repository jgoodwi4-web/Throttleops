import User from "../models/User.js";

export const listDrivers = async (_req, res) => {
  const drivers = await User.find({ role: "driver" }).lean();
  res.json(drivers);
};

export const createDriver = async (req, res) => {
  const { name, email, phone, password = "ChangeMe!123" } = req.body;
  const passwordHash = await User.hashPassword(password);
  const d = await User.create({ name, email, phone, role: "driver", passwordHash, status: "active" });
  res.status(201).json(d);
};

export const updateDriver = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  if (updates.password) {
    updates.passwordHash = await User.hashPassword(updates.password);
    delete updates.password;
  }
  const d = await User.findByIdAndUpdate(id, updates, { new: true });
  res.json(d);
};

export const deleteDriver = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
