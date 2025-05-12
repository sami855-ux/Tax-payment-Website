import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "recipientModel",
      required: true,
    },
    recipientModel: {
      type: String,
      enum: ["taxpayer", "official", "admin"],
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Optional: could be Admin or Official
    },
    type: {
      type: String,
      enum: ["reminder", "warning", "info", "success"],
      default: "info",
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String, // e.g., `/dashboard/filings/123`
    },
    read: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Notification", notificationSchema)
