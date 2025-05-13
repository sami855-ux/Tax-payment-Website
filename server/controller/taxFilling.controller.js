import { startOfMonth, endOfMonth, parseISO } from "date-fns"
import sharp from "sharp"

import TaxFiling from "../models/TaxFilling.js"
import TaxSchedule from "../models/TaxSchedule.js"
import Notification from "../models/Notification.js"
import { calculateTax } from "./taxRule.controller.js"
import { cloudinary } from "../config/cloudairy.js"
import User from "../models/userModel.js"

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

    console.log("Debug values before push:", {
      resumeUrl: cloudResponse?.secure_url,
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
      documentFiled: cloudResponse?.secure_url,
      notes,
      status: "submitted",
      paymentStatus: "unpaid",
      isLate,
      taxSchedules: matchingSchedule,
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

    filing.status = decision

    if (remarks) {
      filing.remarks = remarks
    }

    const calculatedTax = await calculateTax(filing)

    filing.calculatedTax = calculatedTax

    console.log("Filling", filing)

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
