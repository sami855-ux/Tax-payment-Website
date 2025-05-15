import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { validationResult } from "express-validator"
import sharp from "sharp"
import { cloudinary } from "../config/cloudairy.js"

import User from "../models/userModel.js"
import {
  notifyTaxpayerCompletion,
  setupTax,
} from "./Notification.controller.js"
import { generateInitialSchedules } from "./TaxSchedule.controller.js"
import Notification from "../models/Notification.js"
import mongoose from "mongoose"
import Payment from "../models/TaxPayment.js"
import TaxFilling from "../models/TaxFilling.js"
dotenv.config()

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.emailAddress, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

// Register Taxpayer
export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const {
      fullName,
      gender,
      phoneNumber,
      taxId,
      email,
      kebele,
      wereda,
      password,
      role,
    } = req.body

    const existingUser = await User.findOne({
      $or: [{ email }, { taxId }],
    })
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or Tax ID already registered" })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      fullName,
      gender,
      phoneNumber,
      taxId,
      email,
      kebele,
      wereda,
      role: role || "taxpayer",
      password: hashedPassword,
    })

    await newUser.save()

    // 🔐 Create token and set cookie
    const token = createToken(newUser)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    res.status(200).json({
      success: true,
      message: "User registered and logged in",
      user: newUser,
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message })
  }
}

// Login Taxpayer
export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid password" })

    const token = createToken(user)

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: user,
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message })
  }
}

// Middleware to Check Authentication
export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.authToken

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, please log in" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to the request object (can be accessed in next middleware)
    req.user = decoded

    req.userId = decoded.id

    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized, invalid or expired token" })
  }
}

// Get All Taxpayers (Only for Authenticated Users)
export const getAllUser = async (req, res) => {
  try {
    const user = await User.find()
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users: user,
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false })
  }
}

// Delete Taxpayer by ID
export const deleteTaxpayer = async (req, res) => {
  try {
    const { userId } = req.params
    const deleteUser = await User.findByIdAndDelete(userId)

    if (!deleteUser) return res.status(404).json({ message: "User not found" })

    res.clearCookie("authToken")
    res
      .status(200)
      .json({ message: "User deleted successfully", success: true })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false })
  }
}

// Get User by ID
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    })
  }
}

// Update user by ID
export const updateUserById = async (req, res) => {
  let cloudResponse
  try {
    const { userId } = req.params
    const updateData = req.body
    const profilePicture = req.file || null

    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (profilePicture) {
      if (!profilePicture?.mimetype?.startsWith("image/")) {
        return res
          .status(400)
          .json({ error: "Resume must be an image", success: false })
      }
      // Optimize image
      const optimizedImageBuffer = await sharp(profilePicture?.buffer)
        .resize({ width: 1000, height: 1000, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer()

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`

      // Upload to Cloudinary
      cloudResponse = await cloudinary.uploader.upload(fileUri, {
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
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const emailInUse = await User.findOne({ email: updateData.email })

      if (emailInUse) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another user",
        })
      }
    }

    const data = {
      ...updateData,
      profilePhoto: profilePicture ? cloudResponse?.secure_url : "",
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    })

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Error updating user:", error.message)
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while updating the user",
    })
  }
}

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong while logging out",
    })
  }
}

export const changeUserRole = async (req, res) => {
  const { id } = req.params
  const { newRole } = req.body

  const allowedRoles = ["taxpayer", "admin", "official"]

  try {
    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({ message: "Invalid role provided." })
    }

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }

    user.role = newRole
    await user.save()

    res
      .status(200)
      .json({ success: true, message: "User role updated successfully.", user })
  } catch (error) {
    console.error("Error updating role:", error)
    res
      .status(500)
      .json({ message: "Server error while updating role.", success: false })
  }
}

export const completeTaxSetup = async (req, res) => {
  try {
    const userId = req.userId
    const { taxCategory, ...formData } = req.body

    if (
      !taxCategory ||
      !["personal", "business", "vat", "property", "other"].includes(
        taxCategory
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid taxCategory is required",
      })
    }

    // Prepare the update data
    const updateData = {
      isTaxSetupComplete: true,
      selectedCategory: taxCategory,
      $addToSet: { taxCategories: taxCategory },
    }

    // Handle different tax categories
    if (taxCategory === "personal") {
      updateData.$set = {
        "taxDetails.personal": {
          employmentType: formData.employmentType,
          monthlyIncome: Number(formData.monthlyIncome),
          tinNumber: formData.tinNumber,
        },
      }
    } else if (taxCategory === "business") {
      updateData.$set = {
        "taxDetails.business": {
          businessType: formData.businessType,
          businessName: formData.businessName,
          businessLicenseNumber: formData.businessLicenseNumber,
          tinNumber: formData.tinNumber,
          annualRevenueEstimate: Number(formData.annualRevenueEstimate),
        },
      }
    } else if (taxCategory === "vat") {
      updateData.$set = {
        "taxDetails.business": {
          registeredForVAT: formData.registeredForVAT,
          vatRegistrationNumber: formData.vatRegistrationNumber,
          expectedMonthlySales: Number(formData.expectedMonthlySales),
        },
      }
    } else if (taxCategory === "property") {
      updateData.$set = {
        "taxDetails.business": {
          propertyType: formData.propertyType,
          propertyValueEstimate: Number(formData.propertyValueEstimate),
          ownershipStatus: formData.ownershipStatus,
        },
      }
    } else {
      return
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password")

    await notifyTaxpayerCompletion(userId)
    await setupTax(userId)
    await generateInitialSchedules(userId)

    res.status(200).json({
      success: true,
      message: "Tax setup completed successfully",
      user: updatedUser,
    })
  } catch (error) {
    console.error("Tax setup error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// official
export const assignOfficialToTaxpayer = async (req, res) => {
  try {
    const { taxpayerId, officialId } = req.body

    // Validate ObjectId format first
    if (
      !mongoose.Types.ObjectId.isValid(taxpayerId) ||
      !mongoose.Types.ObjectId.isValid(officialId)
    ) {
      return res.status(400).json({
        success: false,
        error: "Invalid ID format provided.",
      })
    }

    if (!taxpayerId || !officialId) {
      return res.status(400).json({
        success: false,
        error: "Both taxpayerId and officialId are required.",
      })
    }

    // Check if the taxpayer already has an official assigned
    const existingTaxpayer = await User.findById(taxpayerId).select(
      "assignedOfficial"
    )
    if (existingTaxpayer && existingTaxpayer.assignedOfficial) {
      return res.status(400).json({
        success: false,
        error: "This taxpayer already has an official assigned.",
      })
    }

    // Make sure the official is actually an official
    const official = await User.findOne({
      _id: new mongoose.Types.ObjectId(officialId),
      role: "official",
    })

    if (!official) {
      return res.status(404).json({
        success: false,
        error: "Official not found or not valid.",
      })
    }

    // Count how many taxpayers are already assigned to this official
    const assignedCount = await User.countDocuments({
      assignedOfficial: new mongoose.Types.ObjectId(officialId),
    })

    if (assignedCount >= 20) {
      return res.status(400).json({
        success: false,
        error:
          "This official is already assigned to the maximum number of taxpayers (20).",
      })
    }

    // Assign the official to the taxpayer
    const updatedTaxpayer = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(taxpayerId) },
      { assignedOfficial: new mongoose.Types.ObjectId(officialId) },
      { new: true }
    )

    if (!updatedTaxpayer) {
      return res.status(404).json({
        success: false,
        error: "Taxpayer not found.",
      })
    }
    await Notification.create({
      recipient: officialId,
      recipientModel: "official",
      type: "success",
      message: `New taxpayer named ${existingTaxpayer.fullName} is assigned to you, check it out on the taxpayer route`,
      link: "/official/taxpayer",
    })

    res.status(200).json({
      success: true,
      message: "Official assigned successfully.",
      taxpayer: updatedTaxpayer,
    })
  } catch (error) {
    console.error("Error assigning official:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error.message,
    })
  }
}

//Get All Taxpayers Assigned to an Official
export const getTaxpayersByOfficial = async (req, res) => {
  try {
    const officialId = req.userId

    const taxpayersWithLastFiling = await User.aggregate([
      {
        $match: {
          assignedOfficial: new mongoose.Types.ObjectId(officialId),
        },
      },
      {
        $lookup: {
          from: "taxfilings", // match your actual collection name
          localField: "_id",
          foreignField: "taxpayer",
          as: "filings",
        },
      },
      {
        $addFields: {
          lastFilingDate: { $max: "$filings.filingDate" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "assignedOfficial",
          foreignField: "_id",
          as: "officialInfo",
        },
      },
      {
        $unwind: {
          path: "$officialInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          fullName: 1,
          taxId: 1,
          kebele: 1,
          phone: "$phoneNumber",
          lastFilingDate: 1,
          isTaxSetupComplete: 1,
          noticesSent: 1,
          profilePhoto: 1,
          wereda: 1,
          email: 1,
          taxCategories: 1,
          taxDetails: 1,
          gender: 1,
          role: 1,
          assignedOfficial: 1,
          officialName: "$officialInfo.fullName",
          assignedDate: "$updatedAt", // or "createdAt" if that's when assignment was done
        },
      },
    ])

    res.status(200).json({ success: true, taxpayers: taxpayersWithLastFiling })
  } catch (error) {
    console.error("Failed to fetch taxpayers:", error)
    res.status(500).json({
      success: false,
      message: "Could not retrieve taxpayers",
      error: error.message,
    })
  }
}

export const getAllOfficials = async (req, res) => {
  console.log("hi")
  try {
    const officials = await User.aggregate([
      {
        $match: { role: "official" },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "assignedOfficial",
          as: "assignedTaxpayers",
        },
      },
      {
        $addFields: {
          assignedCount: { $size: "$assignedTaxpayers" },
        },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          _id: 1,
          profilePhoto: 1,
          assignedCount: 1,
        },
      },
    ])

    res.status(200).json({
      success: true,
      message: "Officials fetched successfully",
      officials,
    })
  } catch (error) {
    console.error("Error fetching officials:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch officials",
    })
  }
}

export const increaseNoticesSent = async (req, res) => {
  try {
    const { taxpayerId } = req.params // Assume taxpayerId is passed in the URL
    const user = await User.findById(taxpayerId)

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Taxpayer not found.",
      })
    }

    // Increase noticesSent by 1
    user.noticesSent += 1

    // Save the updated user
    await user.save()

    res.status(200).json({
      success: true,
      message: "Notices sent count increased by 1.",
      noticesSent: user.noticesSent,
    })
  } catch (error) {
    console.error("Error updating notices sent:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}

export const getOfficialDashboardStats = async (req, res) => {
  try {
    const officialId = req.userId
    // 1. All taxpayers assigned to this official
    const taxpayers = await User.find({
      assignedOfficial: officialId,
      role: "taxpayer",
    })

    const taxpayerIds = taxpayers.map((tp) => tp._id)

    // 2. Total tax collected (only paid or partially paid)
    const payments = await Payment.aggregate([
      {
        $match: {
          taxpayer: { $in: taxpayerIds }, // Filters payments by taxpayer IDs
        },
      },
      {
        $group: {
          _id: null, // Grouping everything together (no grouping by specific field)
          totalCollected: { $sum: "$amount" }, // Sum the amount field to get total collected payments
        },
      },
    ])

    // 3. Total notices sent
    const totalNoticesSent = taxpayers.reduce(
      (acc, user) => acc + (user.noticesSent || 0),
      0
    )

    // 4. Pending tax filings
    const pendingFilingsCount = await TaxFilling.countDocuments({
      taxpayer: { $in: taxpayerIds },
      status: "submitted",
    })

    // 5. Overdue payments
    const overduePaymentsCount = await Payment.countDocuments({
      taxpayer: { $in: taxpayerIds },
      status: "Overdue",
    })

    // 6. Total number of payments made
    const totalPaymentsCount = await Payment.countDocuments({
      taxpayer: { $in: taxpayerIds },
    })

    res.status(200).json({
      success: true,
      data: {
        totalTaxCollected: payments[0]?.totalCollected || 0,
        totalNoticesSent,
        activeTaxpayers: taxpayers.length,
        pendingTaxFilings: pendingFilingsCount,
        overduePayments: overduePaymentsCount,
        totalPaymentsMade: totalPaymentsCount,
      },
    })
  } catch (error) {
    console.error("Error getting official dashboard stats:", error)
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
    })
  }
}
