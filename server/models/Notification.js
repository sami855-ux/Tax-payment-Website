import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["reminder", "alert", "payment", "system"],
      default: "system",
    },
    relatedEntity: {
      // Link to tax filings, payments etc.
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entityModel",
    },
    entityModel: {
      // Dynamic reference
      type: String,
      enum: ["TaxFiling", "Payment", "Taxpayer"],
    },
    isRead: { type: Boolean, default: false },
    priority: { type: Number, default: 1 }, // 1-5 (5 = highest)
    expiresAt: Date, // For time-sensitive notifications
  },
  { timestamps: true }
)

// Indexes for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 })
notificationSchema.index({ createdAt: -1 })

export default mongoose.model("Notification", notificationSchema)
