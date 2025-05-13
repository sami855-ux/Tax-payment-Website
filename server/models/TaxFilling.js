import mongoose from "mongoose"
import TaxPayment from "./TaxPayment.js"
import TaxSchedule from "./TaxSchedule.js"
import TaxRule from "./TaxRule.js"

const taxFilingSchema = new mongoose.Schema(
  {
    taxpayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taxCategory: {
      type: String,
      enum: ["personal", "business", "vat", "property", "other"],
      required: true,
    },
    filingPeriod: {
      type: String,
      required: true,
    },
    filingDate: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["pending", "submitted", "approved", "rejected"],
      default: "pending",
    },
    remarks: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "partially_paid"],
      default: "unpaid",
    },
    paymentDate: {
      type: Date,
    },
    paymentPurpose: {
      type: String,
      required: true,
    },
    documentFiled: {
      type: String, // URL or file path to the uploaded document (e.g., proof of payment, tax documents)
      required: false, // Optional field
    },
    isLate: {
      type: Boolean,
      required: true,
    },
    totalAmount: {
      type: Number,
    },
    calculatedTax: {
      type: Number,
      required: false, // system-calculated
    },
    notes: {
      type: String, // Additional notes or comments about the tax filing
      required: false, // Optional field
    },
    taxPayments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
      },
    ],
    taxRules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TaxRule",
      },
    ],
    taxSchedules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TaxSchedule",
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("TaxFiling", taxFilingSchema)
