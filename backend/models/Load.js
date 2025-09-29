import mongoose from "mongoose";

const LoadItemSchema = new mongoose.Schema(
  {
    description: String,
    qty: { type: Number, default: 1 },
    weightLb: { type: Number, default: 0 },
    lengthFt: Number,
    widthFt: Number,
    heightFt: Number,
    notes: String
  },
  { _id: false }
);

const GeoPingSchema = new mongoose.Schema(
  { lat: Number, lng: Number, at: { type: Date, default: Date.now } },
  { _id: false }
);

const DocSchema = new mongoose.Schema(
  { kind: { type: String, enum: ["BOL", "POD", "Other"], default: "Other" }, url: String, uploadedAt: { type: Date, default: Date.now } },
  { _id: false }
);

const LoadSchema = new mongoose.Schema(
  {
    ref: { type: String, required: true, index: true },
    shipper: { name: String, phone: String, email: String, address: String },
    consignee: { name: String, phone: String, email: String, address: String },
    pickupAddress: String,
    deliveryAddress: String,
    pickupAt: Date,
    deliverBy: Date,
    miles: Number,
    rateTotal: Number,
    currency: { type: String, default: "USD" },
    status: { type: String, enum: ["assigned", "en_route", "delivered", "invoiced", "cancelled"], default: "assigned", index: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    items: [LoadItemSchema],
    tracking: [GeoPingSchema],
    documents: [DocSchema],
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    tags: [String],
    notes: String
  },
  { timestamps: true }
);

LoadSchema.index({ ref: "text", "shipper.name": "text", "consignee.name": "text" });

export default mongoose.model("Load", LoadSchema);
