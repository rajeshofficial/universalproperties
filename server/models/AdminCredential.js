import mongoose from "mongoose";

const adminCredentialSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  salt: { type: String, required: true, select: false },
  passwordChangedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const AdminCredential = mongoose.model("AdminCredential", adminCredentialSchema);
