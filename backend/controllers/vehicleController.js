import Vehicle from "../models/Vehicle.js";

export const listVehicles = async (_req, res) => res.json(await Vehicle.find().lean());

export const createVehicle = async (req, res) => {
  const v = await Vehicle.create(req.body);
  res.status(201).json(v);
};

export const updateVehicle = async (req, res) => {
  const v = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(v);
};

export const deleteVehicle = async (req, res) => {
  await Vehicle.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
