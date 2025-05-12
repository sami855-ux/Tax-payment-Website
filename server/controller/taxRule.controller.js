import TaxRule from "../models/TaxRule.js"

// Utility: Validate progressive brackets
const validateBrackets = (brackets) => {
  if (!Array.isArray(brackets) || brackets.length === 0) {
    return "Progressive tax rules must include at least one bracket."
  }

  for (let i = 0; i < brackets.length; i++) {
    const b = brackets[i]
    if (
      typeof b.minAmount !== "number" ||
      typeof b.maxAmount !== "number" ||
      typeof b.rate !== "number"
    ) {
      return `Bracket ${
        i + 1
      } is missing a valid minAmount, maxAmount, or rate.`
    }
    if (b.minAmount >= b.maxAmount) {
      return `In bracket ${i + 1}, minAmount must be less than maxAmount.`
    }
    if (b.rate < 0 || b.rate > 100) {
      return `In bracket ${i + 1}, rate must be between 0 and 100.`
    }
  }

  return null
}

export const createTaxRule = async (req, res) => {
  try {
    const {
      name,
      category,
      type,
      year,
      fixedAmount,
      percentageRate,
      brackets,
      purpose,
    } = req.body

    if (!name || !category || !type || !year) {
      return res.status(400).json({
        error: "Missing required fields: name, category, type, or year.",
      })
    }

    let newTaxRuleData = {
      name,
      category,
      type,
      year,
      purpose,
      isActive: true,
    }

    if (type === "fixed") {
      if (typeof fixedAmount !== "number" || fixedAmount < 0) {
        return res
          .status(400)
          .json({ error: "Fixed amount must be a positive number." })
      }
      newTaxRuleData.fixedAmount = fixedAmount
    } else if (type === "percentage") {
      if (
        typeof percentageRate !== "number" ||
        percentageRate < 0 ||
        percentageRate > 100
      ) {
        return res.status(400).json({
          error: "Percentage rate must be a number between 0 and 100.",
        })
      }
      newTaxRuleData.percentageRate = percentageRate
    } else if (type === "progressive") {
      const bracketError = validateBrackets(brackets)
      if (bracketError) {
        return res.status(400).json({ error: bracketError })
      }
      newTaxRuleData.brackets = brackets
    } else {
      return res.status(400).json({
        error: "Invalid tax rule type. Use fixed, percentage, or progressive.",
      })
    }

    const newTaxRule = new TaxRule(newTaxRuleData)
    await newTaxRule.save()

    res
      .status(201)
      .json({ message: "Tax rule created successfully", taxRule: newTaxRule })
  } catch (error) {
    console.error("Error creating tax rule:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
