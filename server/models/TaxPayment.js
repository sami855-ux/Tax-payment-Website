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
      enum: ["personal", "business", "vat", "property", "other"], // adjust as needed
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0, // For partial payments, tracks remaining balance
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    method: {
      type: String,
      enum: ["telebirr", "Bank Transfer", "Mobile Money"],
      default: "Bank Transfer",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue", "Failed", "Partially Paid"],
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
    paymentType: {
      type: String,
      enum: ["full", "partial", "scheduled"],
      default: "full", // Default to full payment
    },
    schedule: [
      {
        amount: {
          type: Number,
          required: true,
        },
        dueDate: {
          type: Date,
          required: true,
        },
        paid: {
          type: Boolean,
          default: false, // Tracks if the scheduled payment has been paid
        },
      },
    ], // For scheduled payments only
    taxFiling: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaxFiling", // Reference to the TaxFiling model
      required: true, // A payment should be associated with a tax filing
    },

    // Conditional Fields
    phoneNumber: {
      type: String,
      required: function () {
        return this.method === "telebirr" || this.method === "Mobile Money"
      },
    },
    bankName: {
      type: String,
      required: function () {
        return this.method === "Bank Transfer"
      },
    },
    senderName: {
      type: String,
      required: function () {
        return this.method === "Bank Transfer"
      },
    },
    bankNumber: {
      type: String,
      required: function () {
        return this.method === "Bank Transfer"
      },
    },
    paymentReceiptImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Payment = mongoose.model("Payment", paymentSchema)

export default Payment
