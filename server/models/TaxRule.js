import mongoose from "mongoose"

const taxRuleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  type: {
    type: String,
    enum: ["Fixed", "Percentage", "Progressive"],
    required: true,
  },
  fixedAmount: Number,
  percentageRate: Number,
  brackets: [
    {
      minAmount: Number,
      maxAmount: Number,
      rate: Number,
    },
  ],
  year: { type: Date, required: true },
  purpose: { type: String, required: false },
  isActive: { type: Boolean, default: true },
  penaltyRate: {
    type: Number,
    required: true,
  },
  penaltyCap: {
    type: Number,
    default: 0,
  },
  overdueGracePeriod: {
    type: Number,
    default: 0,
  },
})

const TaxRule = mongoose.model("Rule", taxRuleSchema)

export default TaxRule
