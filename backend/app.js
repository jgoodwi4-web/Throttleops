import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import loadRoutes from "./routes/loadRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import weightRoutes from "./routes/weightRoutes.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/loads", loadRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/weight", weightRoutes);

export default app;
