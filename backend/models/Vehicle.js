import mongoose from "mongoose";

const MaintenanceSchema = new mongoose.Schema(
  {
    type: { type: String, trim: true },
    notes: String,
    cost: Number,
    servicedAt: Date,
    odometer: Number,
    attachments: [String]
  },
  { _id: false, timestamps: true }
);

const InspectionSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["DOT", "Pre-Trip", "Post-Trip"], default: "Pre-Trip" },
    passed: { type: Boolean, default: true },
    defects: [String],
    inspector: { type: String },
    inspectedAt: { type: Date, default: Date.now },
    photos: [String]
  },
  { _id: false }
);

const VehicleSchema = new mongoose.Schema(
  {
    unitNumber: { type: String, trim: true, index: true },
    vin: { type: String, trim: true, unique: true, sparse: true, index: true },
    plate: { type: String, trim: true, index: true },
    make: String,
    model: String,
    year: Number,
    gvwrLb: Number,
    gcwrLb: Number,
    gawrFrontLb: Number,
    gawrRearLb: Number,
    axleCount: Number,
    eld: { provider: String, deviceId: String },
    assignedDriverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    maintenance: [MaintenanceSchema],
    inspections: [InspectionSchema],
    photos: [String],
    notes: String
  },
  { timestamps: true }
);

VehicleSchema.index({ make: 1, model: 1, year: -1 });

export default mongoose.model("Vehicle", VehicleSchema);
