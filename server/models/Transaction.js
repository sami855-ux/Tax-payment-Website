import mongoose from "mongoose"

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    relatedPayment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaxPayment", // optional, depending on context
    },
    type: {
      type: String,
      enum: ["debit", "credit"],
      required: true,
    },
    purpose: {
      type: String, // e.g., "tax_payment", "penalty", "refund"
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["telebirr", "Bank Transfer", "Mobile Money"],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("Transaction", transactionSchema)
