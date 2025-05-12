import mongoose from "mongoose"

const taxRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  type: {
    type: String,
    enum: ["fixed", "percentage", "progressive"],
    required: true,
  },
  fixedAmount: Number, // used if type === "fixed"
  percentageRate: Number, // used if type === "percentage"
  brackets: [
    {
      minAmount: Number,
      maxAmount: Number,
      rate: Number,
    },
  ], // used if type === "progressive"
  year: { type: Date, required: true },
  purpose: { type: String, required: false },
  isActive: { type: Boolean, default: true },
})

const TaxRule = mongoose.model("Rule", taxRuleSchema)

export default TaxRule
