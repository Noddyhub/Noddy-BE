import mongoose from "mongoose";

const userSettingsSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    key: { type: String, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

userSettingsSchema.index({ email: 1, key: 1 }, { unique: true });

export default mongoose.model("UserSettings", userSettingsSchema);
