import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import loadRoutes from "./routes/loadRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import weightRoutes from "./routes/weightRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: process.env.DOTENV_PATH || path.join(__dirname, "../config/.env") });

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/throttleops";
await mongoose.connect(MONGO_URI);

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/loads", loadRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/weight", weightRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
