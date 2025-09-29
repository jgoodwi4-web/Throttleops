import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    loadId: { type: mongoose.Schema.Types.ObjectId, ref: "Load" },
    type: { type: String, enum: ["accident", "breakdown", "cargo_damage", "roadside_inspection", "other"], default: "other", index: true },
    severity: { type: String, enum: ["low", "medium", "high"], default: "low" },
    occurredAt: { type: Date, default: Date.now, index: true },
    location: { lat: Number, lng: Number, address: String },
    notes: String,
    photos: [String],
    policeReportNo: String,
    insuranceFiled: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

IncidentSchema.index({ type: 1, occurredAt: -1 });

export default mongoose.model("Incident", IncidentSchema);
