import DriverLog from "../models/DriverLog.js";

export const listLogs = async (req, res) => {
  const query = {};
  if (req.query.driverId) query.driverId = req.query.driverId;
  res.json(await DriverLog.find(query).sort({ logDate: -1 }).lean());
};

export const createOrUpdateLog = async (req, res) => {
  const { driverId, logDate } = req.body;
  if (!driverId || !logDate) return res.status(400).json({ error: "driverId and logDate required" });
  const log = await DriverLog.findOneAndUpdate({ driverId, logDate }, req.body, { new: true, upsert: true });
  res.status(201).json(log);
};

export const signLog = async (req, res) => {
  const { id } = req.params;
  const { signedBy } = req.body;
  const log = await DriverLog.findByIdAndUpdate(id, { signedBy, signedAt: new Date() }, { new: true });
  res.json(log);
};
