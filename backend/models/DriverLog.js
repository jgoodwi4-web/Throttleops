import mongoose from "mongoose";

const SegmentSchema = new mongoose.Schema(
  {
    status: { type: String, enum: ["off", "sleeper", "driving", "on"], required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    source: { type: String, enum: ["manual", "eld"], default: "manual" },
    notes: String
  },
  { _id: false }
);

const ChecklistItemSchema = new mongoose.Schema(
  { item: String, ok: { type: Boolean, default: true }, notes: String },
  { _id: false }
);

const DriverLogSchema = new mongoose.Schema(
  {
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    logDate: { type: Date, required: true, index: true },
    segments: [SegmentSchema],
    totalDrivingMin: Number,
    totalOnDutyMin: Number,
    totalOffDutyMin: Number,
    totalSleeperMin: Number,
    violations: [String],
    notes: String,
    preTrip: [ChecklistItemSchema],
    postTrip: [ChecklistItemSchema],
    signedBy: { type: String },
    signedAt: { type: Date },
    eld: { deviceId: String, events: [{ code: String, at: Date, data: mongoose.Schema.Types.Mixed }] }
  },
  { timestamps: true }
);

DriverLogSchema.index({ driverId: 1, logDate: -1 });
DriverLogSchema.index({ "eld.deviceId": 1 });

export default mongoose.model("DriverLog", DriverLogSchema);
