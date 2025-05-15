import { startOfMonth, endOfMonth, parseISO } from "date-fns"
import sharp from "sharp"

import TaxFiling from "../models/TaxFilling.js"
import TaxSchedule from "../models/TaxSchedule.js"
import Notification from "../models/Notification.js"
import { applyPenalty, calculateTax } from "./taxRule.controller.js"
import { cloudinary } from "../config/cloudairy.js"
import User from "../models/userModel.js"
import TaxRule from "../models/TaxRule.js"
import moment from "moment"
import Payment from "../models/TaxPayment.js"

export const createTaxFiling = async (req, res) => {
  try {
    const userId = req.userId
    const { taxCategory, filingPeriod, totalAmount, paymentPurpose, notes } =
      req.body
    const documentFiled = req.file || null

    if (!taxCategory || !filingPeriod || !paymentPurpose) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled.",
      })
    }

    if (!documentFiled) {
      return res
        .status(400)
        .json({ error: "Resume image is required", success: false })
    }

    if (!documentFiled.mimetype.startsWith("image/")) {
      return res
        .status(400)
        .json({ error: "Resume must be an image", success: false })
    }
    // Optimize image
    const optimizedImageBuffer = await sharp(documentFiled.buffer)
      .resize({ width: 1000, height: 1000, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer()

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`

    // Upload to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(fileUri, {
      folder: "resumes",
      resource_type: "image",
      timestamp: Math.floor(Date.now() / 1000),
    })

    if (!cloudResponse || !cloudResponse.secure_url) {
      return res
        .status(500)
        .json({ error: "Failed to upload resume image", success: false })
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

    const user = await User.findOne({ _id: userId })

    if (!user) {
      res.status(404).json({
        success: false,
        message: "No user found",
      })
    }
    // Find the matching tax schedule
    const matchingSchedule = await TaxSchedule.findOne({
      taxpayer: userId,
      taxCategory,
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
      totalAmount:
        taxCategory === "personal"
          ? user.taxDetails?.personal?.monthlyIncome
          : totalAmount,
      paymentPurpose,
      documentFiled: cloudResponse?.secure_url,
      notes,
      status: "submitted",
      paymentStatus: "unpaid",
      isLate,
      taxSchedules: matchingSchedule,
      dueDate: matchingSchedule.dueDate,
    })

    await newFiling.save()

    await Notification.create({
      recipient: userId,
      recipientModel: "taxpayer",
      type: "success",
      message: `Your ${taxCategory} tax with ${filingPeriod} filling period is filled successfully, Wait for approval to pay.`,
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

    console.log(filing.taxCategory)

    const taxRule = await TaxRule.findOne({
      category: { $regex: new RegExp(`^${filing.taxCategory}$`, "i") },
    })

    if (!taxRule) {
      return res.status(404).json({
        success: false,
        message: "Tax rule not found.",
      })
    }
    filing.status = decision

    if (remarks) {
      filing.remarks = remarks
    }

    const calculatedTax = await calculateTax(filing)

    const penalty = applyPenaltyFilling(
      filing,
      taxRule.penaltyRate,
      taxRule.penaltyCap
    )

    filing.calculatedTax = calculatedTax + penalty

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

const applyPenaltyFilling = (filling, penaltyRate, penaltyCap) => {
  const currentDate = new Date()
  const dueDate = new Date(filling.dueDate)

  if (currentDate > dueDate) {
    const overdueDays = Math.ceil((currentDate - dueDate) / (1000 * 3600 * 24))

    if (overdueDays > 0) {
      let penaltyAmount = 0

      if (penaltyRate > 0) {
        penaltyAmount = (filling.calculateTax * penaltyRate) / 100
      }

      if (penaltyCap > 0 && penaltyAmount > filling.amount * penaltyCap) {
        penaltyAmount = filling.calculateTax * penaltyCap
      }

      return penaltyAmount
    }
  }

  return 0
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
export const getApprovedTaxFilingsForUser = async (req, res) => {
  try {
    const userId = req.userId

    const approvedFilings = await TaxFiling.find({
      taxpayer: userId,
      status: "approved",
      paymentStatus: { $in: ["unpaid", "partially_paid"] },
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: approvedFilings.length,
      filings: approvedFilings,
    })
  } catch (error) {
    console.error("Error fetching approved tax filings:", error)
    return res.status(500).json({
      success: false,
      message: "Server error while fetching approved tax filings",
    })
  }
}
export const getTaxPaymentTrends = async (req, res) => {
  try {
    // Default to last 12 months if no date range provided
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const paymentTrends = await TaxFiling.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          paymentDate: {
            $exists: true,
            $gte: twelveMonthsAgo, // Default date range filter
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
          },
          totalPaid: { $sum: "$totalAmount" },
          paymentCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          period: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                },
              },
            },
          },
          totalPaid: 1,
          paymentCount: 1,
        },
      },
    ])

    // Fill in missing months with zero values
    const completeData = fillMissingMonths(paymentTrends, twelveMonthsAgo)

    res.json({
      success: true,
      payment: {
        labels: completeData.map((item) => item.period),
        datasets: [
          {
            label: "Total Tax Paid",
            data: completeData.map((item) => item.totalPaid),
            unit: "currency",
          },
          {
            label: "Number of Payments",
            data: completeData.map((item) => item.paymentCount),
            unit: "count",
          },
        ],
      },
    })
  } catch (error) {
    console.error("Error fetching tax payment trends:", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate payment trends",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

function fillMissingMonths(data, startDate) {
  const result = []
  const currentDate = new Date(startDate)
  const now = new Date()

  while (currentDate <= now) {
    const period = currentDate.toISOString().slice(0, 7) // YYYY-MM format
    const existingData = data.find((item) => item.period === period)

    result.push({
      period,
      totalPaid: existingData?.totalPaid || 0,
      paymentCount: existingData?.paymentCount || 0,
    })

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return result
}

export const getPendingTaxFilingsForUser = async (req, res) => {
  try {
    const userId = req.userId

    const pendingFilings = await TaxFiling.find({
      taxpayer: userId,
      status: "submitted",
    }).sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: pendingFilings.length,
      filings: pendingFilings,
    })
  } catch (error) {
    console.error("Error fetching pending tax filings:", error)
    return res.status(500).json({
      success: false,
      message: "Server error while fetching pending tax filings.",
    })
  }
}

export const getTaxTimelineData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear()
    const lastYear = currentYear - 1

    const months = moment.monthsShort()
    const timelineData = months.map((month) => ({
      name: month,
      filings: 0,
      payments: 0,
      lastYear: 0,
    }))

    // Fetch filings for current year
    const thisYearFilings = await TaxFiling.find({
      filingDate: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`),
      },
    })

    // Fetch filings from last year
    const lastYearFilings = await TaxFiling.find({
      filingDate: {
        $gte: new Date(`${lastYear}-01-01`),
        $lte: new Date(`${lastYear}-12-31`),
      },
    })

    // Populate current year data
    for (const filing of thisYearFilings) {
      const monthIndex = new Date(filing.filingDate).getMonth()
      timelineData[monthIndex].filings += 1

      if (
        filing.paymentStatus === "paid" ||
        filing.paymentStatus === "partially_paid"
      ) {
        timelineData[monthIndex].payments += 1
      }
    }

    // Populate last year data
    for (const filing of lastYearFilings) {
      const monthIndex = new Date(filing.filingDate).getMonth()
      timelineData[monthIndex].lastYear += 1
    }

    res.status(200).json({ success: true, timelineData })
  } catch (error) {
    console.error("Error generating tax timeline:", error)
    res.status(500).json({ error: "Server error while fetching timeline data" })
  }
}

export const getRecentActivityFeed = async (req, res) => {
  try {
    const recentFilings = await TaxFiling.find({
      status: { $in: ["submitted", "approved"] },
    })
      .populate("taxpayer", "fullName businessName")
      .sort({ createdAt: -1 })
      .limit(5)

    const filedActivities = recentFilings.map((filing) => ({
      type: "filed",
      name: filing.taxpayer?.fullName || "-",
      amount: null,
    }))

    // Get missed filings (pending & late)
    const missedFilings = await TaxFiling.find({
      status: "pending",
      isLate: true,
    })
      .populate("taxpayer", "fullName ")
      .sort({ createdAt: -1 })
      .limit(5)

    const missedActivities = missedFilings.map((filing) => ({
      type: "missed",
      name: filing.taxpayer.fullName,
      amount: null,
    }))

    // Get recent payments
    const recentPayments = await Payment.find({
      status: { $in: ["Paid", "Partially Paid"] },
    })
      .populate("taxpayer", "fullName")
      .sort({ paymentDate: -1 })
      .limit(5)

    const paidActivities = recentPayments.map((payment) => ({
      type: "paid",
      name: payment.taxpayer?.fullName || " -",
      amount: payment?.amount || " -",
    }))

    const merged = [
      ...filedActivities,
      ...missedActivities,
      ...paidActivities,
    ].sort(() => Math.random() - 0.5)

    const activityData = merged.slice(0, 7)

    res.status(200).json({ activityData, success: true })
  } catch (err) {
    console.error("Error generating activity feed:", err)
    res.status(500).json({ error: "Failed to get activity feed" })
  }
}
