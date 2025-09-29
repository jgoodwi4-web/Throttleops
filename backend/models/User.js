import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ["admin", "dispatcher", "driver"], default: "driver", index: true },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    passwordHash: { type: String, required: true },
    companyName: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

UserSchema.statics.hashPassword = async function (plain) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
};

UserSchema.index({ name: "text", email: "text" });

export default mongoose.model("User", UserSchema);
