import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  callbackId: { type: String, required: true, unique: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Token", tokenSchema);
