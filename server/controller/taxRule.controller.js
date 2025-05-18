import TaxRule from "../models/TaxRule.js"
import User from "../models/userModel.js"

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
      fixed,
      percentage,
      bracket,
      purpose,
      penaltyCap,
      penaltyRate,
      taxType,
    } = req.body

    if (!name || !category || !type || !year) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: name, category, type, or year.",
      })
    }

    const existingRule = await TaxRule.findOne({
      category,
      year: new Date(year),
    })

    if (existingRule) {
      return res.status(409).json({
        success: false,
        error: `A tax rule for category '${category}' already exists for the year ${new Date(
          year
        ).getFullYear()}.`,
      })
    }

    let newTaxRuleData = {
      name,
      category,
      type,
      year: new Date(year),
      purpose,
      isActive: true,
      penaltyRate,
      penaltyCap,
      taxType,
    }

    if (type === "Fixed") {
      if (typeof fixed !== "number" || fixed < 0) {
        return res.status(400).json({
          error: "Fixed amount must be a positive number.",
          success: false,
        })
      }
      newTaxRuleData.fixedAmount = fixed
    } else if (type === "Percentage") {
      if (
        typeof percentage !== "number" ||
        percentage < 0 ||
        percentage > 100
      ) {
        return res.status(400).json({
          error: "Percentage rate must be a number between 0 and 100.",
          success: false,
        })
      }
      newTaxRuleData.percentageRate = percentage
    } else if (type === "Progressive") {
      const bracketError = validateBrackets(bracket)
      if (bracketError) {
        return res.status(400).json({ error: bracketError, success: false })
      }
      newTaxRuleData.brackets = bracket
    } else {
      return res.status(400).json({
        error: "Invalid tax rule type. Use Fixed, Percentage, or Progressive.",
        success: false,
      })
    }

    const newTaxRule = new TaxRule(newTaxRuleData)
    await newTaxRule.save()

    res.status(201).json({
      message: "Tax rule created successfully",
      taxRule: newTaxRule,
      success: true,
    })
  } catch (error) {
    console.error("Error creating tax rule:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getAllTaxRules = async (req, res) => {
  try {
    const taxRules = await TaxRule.find().sort({ year: -1 })

    res.status(200).json({
      success: true,
      count: taxRules.length,
      taxRules,
    })
  } catch (error) {
    console.error("Error fetching tax rules:", error)
    res.status(500).json({
      success: false,
      error: "Failed to retrieve tax rules. Please try again later.",
    })
  }
}
export const updateTaxRule = async (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      category,
      type,
      year,
      purpose,
      isActive,
      fixed,
      percentage,
      bracket,
    } = req.body

    const taxRule = await TaxRule.findById(id)
    if (!taxRule) {
      return res
        .status(404)
        .json({ success: false, error: "Tax rule not found" })
    }

    // General fields
    if (name !== undefined) taxRule.name = name
    if (category !== undefined) taxRule.category = category
    if (year !== undefined) taxRule.year = year
    if (purpose !== undefined) taxRule.purpose = purpose
    if (isActive !== undefined) taxRule.isActive = isActive

    // If type is being updated, reset other values
    if (type !== undefined) {
      if (!["Fixed", "Percentage", "Progressive"].includes(type)) {
        return res.status(400).json({
          success: false,
          error: "Invalid type. Must be Fixed, Percentage, or Progressive.",
        })
      }
      taxRule.type = type
      taxRule.fixedAmount = undefined
      taxRule.percentageRate = undefined
      taxRule.brackets = []
    }

    // Type-specific updates (based on either new or existing type)
    const finalType = type || taxRule.type

    if (finalType === "Fixed") {
      if (typeof fixed !== "number" || fixed < 0) {
        return res.status(400).json({
          success: false,
          error: "Fixed amount must be a positive number.",
        })
      }
      taxRule.fixedAmount = fixed
    }

    if (finalType === "Percentage") {
      if (
        typeof percentage !== "number" ||
        percentage < 0 ||
        percentage > 100
      ) {
        return res.status(400).json({
          success: false,
          error: "Percentage rate must be a number between 0 and 100.",
        })
      }
      taxRule.percentageRate = percentage
    }

    if (finalType === "Progressive") {
      const bracketError = validateBrackets(bracket)
      if (bracketError) {
        return res.status(400).json({ success: false, error: bracketError })
      }
      taxRule.brackets = bracket
    }

    await taxRule.save()

    res.status(200).json({
      success: true,
      message: "Tax rule updated successfully.",
      taxRule,
    })
  } catch (error) {
    console.error("Error updating tax rule:", error)
    res.status(500).json({ success: false, error: "Internal server error" })
  }
}

export const deleteTaxRule = async (req, res) => {
  try {
    const { id } = req.params

    const deletedTaxRule = await TaxRule.findByIdAndDelete(id)

    if (!deletedTaxRule) {
      return res.status(404).json({
        success: false,
        error: "Tax rule not found.",
      })
    }

    res.status(200).json({
      success: true,
      message: "Tax rule deleted successfully.",
      deletedTaxRule,
    })
  } catch (error) {
    console.error("Error deleting tax rule:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error.",
    })
  }
}

export const calculateTax = async (filing) => {
  const category = filing.taxCategory
  let taxAmount = 0

  // Fetch tax rule for the specific category
  const taxRule = await TaxRule.findOne({
    category: new RegExp(`^${category}$`, "i"),
    isActive: true,
  })

  if (!taxRule) {
    throw new Error(`No tax rule found for category: ${category}`)
  }

  if (category === "personal") {
    // Fetch user details to get monthlyIncome
    const user = await User.findById(filing.taxpayer)
    if (
      !user ||
      !user.taxDetails ||
      !user.taxDetails.personal ||
      !user.taxDetails.personal.monthlyIncome
    ) {
      throw new Error("User income not found or invalid")
    }

    const monthlyIncome = Number(user.taxDetails.personal.monthlyIncome)

    console.log("monthlyIncome", monthlyIncome)
    // Calculate tax based on the tax rule type
    if (taxRule.type === "Fixed") {
      taxAmount = taxRule.fixedAmount // Direct fixed tax amount
    } else if (taxRule.type === "Percentage") {
      taxAmount = monthlyIncome * (taxRule.percentageRate / 100) // Percentage-based tax
    } else if (taxRule.type === "Progressive") {
      const brackets = taxRule.brackets.sort(
        (a, b) => a.minAmount - b.minAmount
      )

      let matched = false

      for (const bracket of brackets) {
        if (
          monthlyIncome >= bracket.minAmount &&
          monthlyIncome <= bracket.maxAmount
        ) {
          taxAmount = monthlyIncome * (bracket.rate / 100)
          matched = true
          break
        }
      }

      // If income is higher than any bracket, apply the last (highest) bracket rate
      if (!matched && brackets.length > 0) {
        const topBracket = brackets[brackets.length - 1]
        if (monthlyIncome > topBracket.maxAmount) {
          taxAmount = monthlyIncome * (topBracket.rate / 100)
        }
      }
    }
  } else {
    const totalAmount = filing.totalAmount

    if (taxRule.type === "Fixed") {
      taxAmount = taxRule.fixedAmount // Direct fixed tax amount
    } else if (taxRule.type === "Percentage") {
      taxAmount = totalAmount * (taxRule.percentageRate / 100) // Percentage-based tax
    } else if (taxRule.type === "Progressive") {
      const brackets = taxRule.brackets.sort(
        (a, b) => a.minAmount - b.minAmount
      )
      for (const bracket of brackets) {
        if (
          totalAmount >= bracket.minAmount &&
          totalAmount <= bracket.maxAmount
        ) {
          taxAmount = totalAmount * (bracket.rate / 100)
          break
        }
      }
    }
  }

  console.log("approved and calculated", taxAmount)
  return taxAmount
}

export const applyPenalty = (payment, penaltyRate, penaltyCap) => {
  const currentDate = new Date()
  const dueDate = new Date(payment.dueDate)

  // Check if payment is overdue
  if (currentDate > dueDate) {
    // Calculate the overdue period
    const overdueDays = Math.ceil((currentDate - dueDate) / (1000 * 3600 * 24))

    // If overdue, apply penalty
    if (overdueDays > 0) {
      // Calculate penalty based on the rate (percentage) or fixed amount
      let penaltyAmount = 0

      // Percentage penalty
      if (penaltyRate > 0) {
        penaltyAmount = (payment.amount * penaltyRate) / 100
      }

      // If penalty cap is provided, ensure the penalty does not exceed the cap
      if (penaltyCap > 0 && penaltyAmount > payment.amount * penaltyCap) {
        penaltyAmount = payment.amount * penaltyCap
      }

      return penaltyAmount
    }
  }

  return 0
}
