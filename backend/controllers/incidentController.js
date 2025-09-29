import Incident from "../models/Incident.js";

export const listIncidents = async (_req, res) => res.json(await Incident.find().lean());

export const createIncident = async (req, res) => {
  const inc = await Incident.create(req.body);
  res.status(201).json(inc);
};

export const updateIncident = async (req, res) => {
  const inc = await Incident.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(inc);
};
