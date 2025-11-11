import mongoose from "mongoose";

const lanSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      default: "",
    },
    files: {
      type: [
        {
          name: { type: String, required: true },
          path: { type: String, required: true },
          size: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lan", lanSchema);
