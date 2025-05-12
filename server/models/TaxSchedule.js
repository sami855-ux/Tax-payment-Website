// models/TaxSchedule.js
import mongoose from "mongoose"

const taxScheduleSchema = new mongoose.Schema(
  {
    taxpayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taxCategory: {
      type: String,
      required: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "filed", "paid", "overdue"],
      default: "pending",
    },
    remarks: {
      type: String,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model("TaxSchedule", taxScheduleSchema)
