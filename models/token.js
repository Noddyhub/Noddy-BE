import mongoose from "mongoose";

const userTokenSchema = new mongoose.Schema({
  callbackId: { type: String, unique: true },
  token: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserToken", userTokenSchema);
