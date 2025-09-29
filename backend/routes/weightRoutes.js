import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const r = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const weightsPath = path.resolve(__dirname, "../../web/public/data/weights.json");

r.get("/reference", (_, res) => {
  try {
    const data = fs.readFileSync(weightsPath, "utf-8");
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: "Weights not available" });
  }
});

export default r;
