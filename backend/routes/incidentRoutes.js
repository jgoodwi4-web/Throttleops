import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { listIncidents, createIncident, updateIncident } from "../controllers/incidentController.js";
const r = Router();
r.use(requireAuth);
r.get("/", listIncidents);
r.post("/", createIncident);
r.patch("/:id", updateIncident);
export default r;
