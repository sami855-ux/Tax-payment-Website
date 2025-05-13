import { startOfMonth, endOfMonth, parseISO } from "date-fns"

import TaxFiling from "../models/TaxFilling.js"
import TaxSchedule from "../models/TaxSchedule.js"
import Notification from "../models/Notification.js"
import User from "../models/userModel.js"

export const createTaxFiling = async (req, res) => {
  try {
    const userId = req.userId
    const {
      taxCategory,
      filingPeriod,
      totalAmount,
      paymentPurpose,
      documentFiled,
      notes,
    } = req.body

    if (!taxCategory || !filingPeriod || !paymentPurpose) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      })
    }

    // Check if already filed
    const existingFiling = await TaxFiling.findOne({
      taxpayer: userId,
      taxCategory,
      filingPeriod,
    })

    if (existingFiling) {
      return res.status(409).json({
        success: false,
        message: "You have already filed for this period and category.",
      })
    }

    // Parse the filing period into date range
    const periodStart = startOfMonth(parseISO(filingPeriod + "-01"))
    const periodEnd = endOfMonth(periodStart)

    // Find the matching tax schedule
    const matchingSchedule = await TaxSchedule.findOne({
      taxpayer: userId,
      taxCategory,
      status: "pending",
    })

    let isLate = false
    if (matchingSchedule) {
      const now = new Date()
      isLate = now > matchingSchedule.dueDate
      matchingSchedule.status = "filed"
      await matchingSchedule.save()
    }

    // Create the filing record
    const newFiling = new TaxFiling({
      taxpayer: userId,
      taxCategory,
      filingPeriod,
      totalAmount,
      paymentPurpose,
      documentFiled,
      notes,
      status: "submitted",
      paymentStatus: "unpaid",
      isLate,
    })

    await newFiling.save()

    await Notification.create({
      recipient: userId,
      recipientModel: "taxpayer",
      type: "success",
      message: `Your ${taxCategory} with ${filingPeriod} period is filled successfully `,
    })
    return res.status(201).json({
      success: true,
      message: isLate
        ? "Tax filing submitted (Late filing)."
        : "Tax filing submitted successfully.",
      filing: newFiling,
      isLate,
      updatedSchedule: matchingSchedule,
    })
  } catch (error) {
    console.error("Tax filing creation error:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to create tax filing.",
    })
  }
}

export const reviewTaxFiling = async (req, res) => {
  try {
    const { filingId, decision, remarks, userId } = req.body

    if (
      !filingId ||
      !decision ||
      !["approved", "rejected"].includes(decision)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input. Please provide filingId and decision ('approved' or 'rejected').",
      })
    }

    // Find the tax filing using filingId
    const filing = await TaxFiling.findById(filingId)
    if (!filing) {
      return res.status(404).json({
        success: false,
        message: "Tax filing not found.",
      })
    }

    filing.status = decision

    if (remarks) {
      filing.remarks = remarks
    }

    await filing.save()

    await Notification.create({
      recipient: userId,
      recipientModel: "taxpayer",
      type: `${decision === "approved" ? "success" : "info"}`,
      message: `Your tax filling is ${decision}, ${
        decision === "approved" ? "you can now pay your tax" : "Fill in again"
      }`,
      link: "/user/paytax",
    })

    return res.status(200).json({
      success: true,
      message: `Tax filing ${decision} successfully.`,
      filing,
    })
  } catch (error) {
    console.error("Error reviewing tax filing:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    })
  }
}

export const getAllAssignedTaxpayerFilings = async (req, res) => {
  try {
    const officialId = req.userId

    const official = await User.findById(officialId).select("role")
    if (!official || official.role !== "official") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only officials can access taxpayer filings.",
      })
    }

    // Get taxpayers assigned to this official
    const assignedTaxpayers = await User.find({
      assignedOfficial: officialId,
    }).select("_id")

    const taxpayerIds = assignedTaxpayers.map((tp) => tp._id)

    if (taxpayerIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No taxpayers assigned to this official.",
        filings: [],
      })
    }

    const filings = await TaxFiling.find({ taxpayer: { $in: taxpayerIds } })
      .sort({ createdAt: -1 })
      .populate("taxpayer", "fullName taxId _id")

    const formattedFilings = filings.map((filing, index) => ({
      id: filing._id,
      taxpayer: filing.taxpayer?.fullName || "N/A",
      tin: filing.taxpayer?.taxId || "N/A",
      taxType: filing.taxCategory?.toUpperCase() || "N/A",
      period: filing.filingPeriod,
      amount: `${filing.totalAmount?.toLocaleString()} ETB`,
      status: filing.status,
      submittedOn: new Date(filing.filingDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      taxpayerId: filing.taxpayer._id,
    }))

    res.status(200).json({
      success: true,
      message: "Tax filings retrieved successfully.",
      count: formattedFilings.length,
      filings: formattedFilings,
    })
  } catch (error) {
    console.error("Error fetching tax filings:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch tax filings for the assigned taxpayers.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}
