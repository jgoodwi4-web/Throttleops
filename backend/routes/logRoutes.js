import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { listLogs, createOrUpdateLog, signLog } from "../controllers/logController.js";
const r = Router();
r.use(requireAuth);
r.get("/", listLogs);
r.post("/", createOrUpdateLog);
r.post("/:id/sign", signLog);
export default r;
