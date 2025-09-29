import mongoose from "mongoose";

const LineItemSchema = new mongoose.Schema(
  { description: { type: String, required: true }, qty: { type: Number, default: 1 }, unitPrice: { type: Number, default: 0 }, amount: { type: Number, default: 0 } },
  { _id: false }
);

const PaymentSchema = new mongoose.Schema(
  { amount: { type: Number, required: true }, method: { type: String, enum: ["card", "ach", "check", "cash", "other"], default: "other" }, ref: String, paidAt: { type: Date, default: Date.now }, notes: String },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    loadId: { type: mongoose.Schema.Types.ObjectId, ref: "Load", index: true },
    number: { type: String, required: true, unique: true, index: true },
    customer: { name: { type: String, required: true }, email: String, phone: String, address: String },
    issueDate: { type: Date, default: Date.now },
    dueDate: Date,
    terms: { type: String, default: "Net 30" },
    items: [LineItemSchema],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "sent", "paid", "overdue", "void"], default: "draft", index: true },
    payments: [PaymentSchema],
    notes: String,
    pdfUrl: String
  },
  { timestamps: true }
);

InvoiceSchema.index({ "customer.name": "text" });

export default mongoose.model("Invoice", InvoiceSchema);
