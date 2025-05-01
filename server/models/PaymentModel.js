import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
  {
    taxpayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taxCategory: {
      type: String,
      required: true,
      enum: ["Income Tax", "VAT", "Business Tax", "Property Tax", "Other"], // adjust as needed
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: null, // updated when payment is made
    },
    method: {
      type: String,
      enum: ["Card", "Bank Transfer", "Mobile Money", "Cash"],
      default: "Bank Transfer",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue", "Failed"],
      default: "Pending",
    },
    receiptUrl: {
      type: String,
      default: "",
    },
    referenceId: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Payment = mongoose.model("Payment", paymentSchema)

export default Payment
