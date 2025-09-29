import Load from "../models/Load.js";

export const listLoads = async (_req, res) => res.json(await Load.find().lean());

export const createLoad = async (req, res) => {
  const l = await Load.create(req.body);
  res.status(201).json(l);
};

export const getLoad = async (req, res) => {
  const l = await Load.findById(req.params.id).lean();
  if (!l) return res.status(404).json({ error: "Not found" });
  res.json(l);
};

export const updateLoad = async (req, res) => {
  const l = await Load.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(l);
};

export const trackPing = async (req, res) => {
  const { lat, lng } = req.body;
  const l = await Load.findById(req.params.id);
  if (!l) return res.status(404).json({ error: "Not found" });
  l.tracking.push({ lat, lng, at: new Date() });
  await l.save();
  res.json({ ok: true });
};
