import Invoice from "../models/Invoice.js";
import Load from "../models/Load.js";

export const listInvoices = async (_req, res) => res.json(await Invoice.find().lean());

export const createFromLoad = async (req, res) => {
  const load = await Load.findById(req.params.loadId).lean();
  if (!load) return res.status(404).json({ error: "Load not found" });

  const number = `INV-${Date.now()}`;
  const inv = await Invoice.create({
    loadId: load._id,
    number,
    customer: { name: load.consignee?.name || "Customer" },
    items: [{ description: `Freight ${load.ref}`, qty: 1, unitPrice: load.rateTotal || 0, amount: load.rateTotal || 0 }],
    subtotal: load.rateTotal || 0,
    total: load.rateTotal || 0,
    status: "sent",
  });

  res.status(201).json(inv);
};
 
export const markPaid = async (req, res) => {
  const inv = await Invoice.findById(req.params.id);
  if (!inv) return res.status(404).json({ error: "Not found" });
  inv.status = "paid";
  inv.payments.push({ amount: inv.total || 0, method: "other", ref: "manual", paidAt: new Date() });
  await inv.save();
  res.json(inv);
};
