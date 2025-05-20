import Payment from "../models/TaxPayment.js"
import TaxFiling from "../models/TaxFilling.js"
import Transaction from "../models/Transaction.js"
import Notification from "../models/Notification.js"
import User from "../models/userModel.js"

import sharp from "sharp"
import { cloudinary } from "../config/cloudairy.js"
import { v4 as uuidv4 } from "uuid"
import mongoose from "mongoose"

const createPayment = async (req, res) => {
  const MAX_RETRIES = 5
  let retryCount = 0

  while (retryCount < MAX_RETRIES) {
    const session = await mongoose.startSession()
    try {
      session.startTransaction()

      // all your logic here: extract body, upload image, validate, etc.
      // up to await session.commitTransaction()

      const {
        taxFilingId,
        amount,
        paymentType,
        method,
        dueDate,
        phoneNumber,
        bankName,
        senderName,
        bankNumber,
        payAmount,
      } = req.body

      const paymentReceiptImage = req.file || null
      const referenceId = uuidv4()

      const taxFiling = await TaxFiling.findById(taxFilingId).session(session)
      if (!taxFiling) {
        return res
          .status(404)
          .json({ success: false, message: "Tax filing not found." })
      }

      if (!paymentReceiptImage) {
        return res
          .status(400)
          .json({ error: "paymentReceiptImage is required", success: false })
      }

      const optimizedImageBuffer = await sharp(paymentReceiptImage.buffer)
        .resize({ width: 1000, height: 1000, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer()

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`

      const cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: "resumes",
        resource_type: "image",
        timestamp: Math.floor(Date.now() / 1000),
      })

      if (!cloudResponse?.secure_url) {
        return res
          .status(500)
          .json({ error: "Failed to upload receipt image", success: false })
      }

      if (
        (method === "telebirr" || method === "Mobile Money") &&
        !phoneNumber
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Phone number is required" })
      }
      if (
        method === "Bank Transfer" &&
        (!bankName || !senderName || !bankNumber)
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Bank details required" })
      }

      const payment = new Payment({
        taxpayer: taxFiling.taxpayer,
        taxCategory: taxFiling.taxCategory,
        amount,
        dueDate,
        paymentType,
        method,
        referenceId,
        taxFiling: taxFilingId,
        phoneNumber,
        bankName,
        senderName,
        bankNumber,
        paymentReceiptImage: cloudResponse.secure_url,
      })

      if (paymentType === "full") {
        payment.remainingAmount = 0
      } else if (paymentType === "partial") {
        payment.remainingAmount = payAmount > amount ? 0 : amount - payAmount
      }

      await payment.save({ session })
      taxFiling.taxPayments.push(payment._id)
      await taxFiling.save({ session })

      await updateTaxFilingStatus(taxFilingId, session)

      const [transaction] = await Transaction.create(
        [
          {
            user: taxFiling.taxpayer,
            relatedPayment: payment._id,
            type: "debit",
            purpose: "tax_payment",
            amount,
            status: "success",
            method,
            timestamp: new Date(),
            note: `Payment for ${taxFiling.taxCategory} tax`,
          },
        ],
        { session }
      )

      await transaction.save({ session })
      await session.commitTransaction()
      session.endSession()

      await Notification.create({
        recipient: taxFiling.taxpayer,
        recipientModel: "taxpayer",
        type: "success",
        message: `Your ${taxFiling.taxCategory} tax with the amount of ${amount} birr is paid successfully.`,
      })

      return res
        .status(201)
        .json({ success: true, payment, message: "Payment success" })
    } catch (error) {
      await session.abortTransaction()
      session.endSession()

      if (
        error.codeName === "WriteConflict" ||
        error.errorLabels?.includes("TransientTransactionError")
      ) {
        retryCount++
        console.warn(
          `Retrying transaction due to write conflict... (${retryCount}/${MAX_RETRIES})`
        )
      } else {
        console.error("Error creating payment:", error)
        return res
          .status(500)
          .json({ success: false, message: "Error processing payment." })
      }
    }
  }

  return res.status(500).json({
    success: false,
    message: "Payment failed after multiple retries due to write conflicts.",
  })
}

// Update the payment status based on the amount paid
const updateTaxFilingStatus = async (taxFilingId, session) => {
  const taxFiling = await TaxFiling.findById(taxFilingId)
    .populate({
      path: "taxPayments",
      options: { session },
    })
    .session(session)

  if (!taxFiling) {
    throw new Error("Tax filing not found.")
  }

  const totalPaid = taxFiling.taxPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  )

  console.log(totalPaid, taxFiling.calculatedTax)

  // Determine payment status
  if (totalPaid >= taxFiling.calculatedTax) {
    taxFiling.paymentStatus = "paid"
  } else if (totalPaid > 0) {
    taxFiling.paymentStatus = "partially_paid"
  } else {
    taxFiling.paymentStatus = "unpaid"
  }

  await taxFiling.save()
}

export const getAllPaymentsForUser = async (req, res) => {
  try {
    const userId = req.userId

    const payments = await Payment.find({ taxpayer: userId })
      .populate("taxFiling") // Include tax filing details
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    })
  } catch (error) {
    console.error("Error fetching user payments:", error)
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user payments.",
    })
  }
}

export const getPaymentsForOfficial = async (req, res) => {
  try {
    const userId = req.userId

    // Get the official by ID
    const official = await User.findById(userId)

    if (!official || official.role !== "official") {
      return res.status(403).json({ message: "Access denied" })
    }

    // Get all taxpayers assigned to this official
    const assignedTaxpayers = await User.find({
      assignedOfficial: official._id,
    }).select("_id fullName taxId")

    const taxpayerIds = assignedTaxpayers.map((u) => u._id)

    // Fetch all payments by those taxpayers
    const payments = await Payment.find({
      taxpayer: { $in: taxpayerIds },
    })
      .populate("taxpayer", "fullName taxId")
      .sort({ createdAt: -1 })

    const formatted = payments.map((p) => ({
      id: p._id,
      paymentId: p.referenceId,
      taxpayerName: p.taxpayer?.fullName || "N/A",
      taxType: p.taxCategory,
      amount: p.amount,
      datePaid: p.paymentDate
        ? p.paymentDate.toISOString().split("T")[0]
        : null,
      paymentMethod: p.method,
      status: p.status === "Paid" ? "Verified" : p.status,
      taxpayerId: p.taxpayer?.taxId || "N/A",
      paymentReceiptImage: p.paymentReceiptImage || "N/A",
    }))

    return res.status(200).json({ success: true, payment: formatted })
  } catch (error) {
    console.error("Error fetching payments for official:", error)
    return res.status(500).json({ success: false, message: "Server Error" })
  }
}

export const approvePayment = async (req, res) => {
  try {
    const { status } = req.body
    const { paymentId } = req.params

    console.log(status)
    if (!paymentId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID is required",
      })
    }

    const payment = await Payment.findById(paymentId)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    if (payment.status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Payment is already approved",
      })
    }

    // Update payment status and paymentDate
    payment.status = status
    payment.paymentDate = new Date()

    await payment.save()

    await Notification.create({
      recipient: payment.taxpayer,
      recipientModel: "taxpayer",
      type: "success",
      message: `Your ${payment.taxCategory} tax is approved successfully`,
    })

    res.status(200).json({
      success: true,
      message: "Payment approved successfully",
      payment,
    })
  } catch (error) {
    console.error("Approve payment error:", error)
    res.status(500).json({
      success: false,
      message: "Server error during payment approval",
    })
  }
}

export const getAllPaymentsForAdmin = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("taxpayer", "fullName email") // Add any fields you need
      .sort({ createdAt: -1 })

    const formattedPayments = payments.map((payment) => ({
      referenceId: payment.referenceId,
      taxpayerName: payment.taxpayer?.fullName || "N/A",
      taxCategory: payment.taxCategory,
      amount: payment.amount,
      paymentMethod: payment.method,
      status: payment.status,
      paymentDate: payment.paymentDate,
      date: payment.dueDate,
    }))

    res.status(200).json({
      success: true,
      payments: formattedPayments,
    })
  } catch (error) {
    console.error("Failed to fetch payment records:", error)
    res.status(500).json({ message: "Failed to retrieve payments" })
  }
}

// GET /api/dashboard/monthly-trend
export const getMonthlyTrends = async (req, res) => {
  try {
    // 1. Monthly Collection Trend (by Payment Date)
    const monthlyCollections = await Payment.aggregate([
      {
        $match: {
          paymentDate: { $ne: null },
          status: "Paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
          },
          totalCollected: { $sum: "$amount" },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "/",
              { $toString: "$_id.year" },
            ],
          },
          totalCollected: 1,
          _id: 0,
        },
      },
    ])

    // 2. Filing Distribution (group by category & status)
    const filingDistribution = await TaxFiling.aggregate([
      {
        $group: {
          _id: { taxCategory: "$taxCategory", status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.taxCategory",
          statuses: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
          total: { $sum: "$count" },
        },
      },
      {
        $project: {
          category: "$_id",
          statuses: 1,
          total: 1,
          _id: 0,
        },
      },
    ])

    // 3. Filing Calendar (group by filingDate)
    const filingCalendar = await TaxFiling.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$filingDate" },
            month: { $month: "$filingDate" },
            day: { $dayOfMonth: "$filingDate" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          count: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ])

    const report = { monthlyCollections, filingDistribution, filingCalendar }

    res.json({
      success: true,
      report,
    })
  } catch (err) {
    console.error("Error generating trends:", err)
    res.status(500).json({ success: false, message: "Failed to get trends" })
  }
}

export { createPayment }
