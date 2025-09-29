import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { listInvoices, createFromLoad, markPaid } from "../controllers/invoiceController.js";
const r = Router();
r.use(requireAuth);
r.get("/", listInvoices);
r.post("/from-load/:loadId", requireRole("admin","dispatcher"), createFromLoad);
r.post("/:id/paid", requireRole("admin","dispatcher"), markPaid);
export default r;
