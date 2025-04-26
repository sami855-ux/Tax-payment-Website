import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { validationResult } from "express-validator"

import Taxpayer from "../models/userModel.js"

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
      emailAddress,
      residentialAddress,
      kebele,
      wereda,
      password,
      role,
    } = req.body

    const existingUser = await Taxpayer.findOne({
      $or: [{ emailAddress }, { taxId }],
    })
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or Tax ID already registered" })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newTaxpayer = new Taxpayer({
      fullName,
      gender,
      phoneNumber,
      taxId,
      emailAddress,
      residentialAddress,
      kebele,
      wereda,
      role: role || "taxpayer",
      password: hashedPassword,
    })

    await newTaxpayer.save()

    // 🔐 Create token and set cookie
    const token = createToken(newTaxpayer)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })

    res.status(201).json({
      success: true,
      message: "Taxpayer registered and logged in",
      user: newTaxpayer,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Login Taxpayer
export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() })

    const { emailAddress, password } = req.body

    const taxpayer = await Taxpayer.findOne({ emailAddress })
    if (!taxpayer)
      return res.status(400).json({ message: "Invalid email or password" })

    const isMatch = await bcrypt.compare(password, taxpayer.password)
    if (!isMatch) return res.status(400).json({ message: "Invalid password" })

    const token = createToken(taxpayer)

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: taxpayer,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Middleware to Check Authentication
export const isAuthenticated = (req, res, next) => {
  const token = req.cookies.authToken

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, please log in" })
  }

  try {
    // Verify the token and decode the user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to the request object (can be accessed in next middleware)
    req.user = decoded

    next()
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized, invalid or expired token" })
  }
}

// Get All Taxpayers (Only for Authenticated Users)
export const getAllTaxpayers = async (req, res) => {
  try {
    const taxpayers = await Taxpayer.find()
    res.status(200).json(taxpayers)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update Taxpayer by ID
export const updateTaxpayer = async (req, res) => {
  try {
    const { taxPayerId } = req.params
    const updatedTaxpayer = await Taxpayer.findByIdAndUpdate(
      taxPayerId,
      req.body,
      { new: true }
    )
    if (!updatedTaxpayer)
      return res.status(404).json({ message: "Taxpayer not found" })

    res.status(200).json({
      message: "Taxpayer updated successfully",
      taxpayer: updatedTaxpayer,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete Taxpayer by ID
export const deleteTaxpayer = async (req, res) => {
  try {
    const { taxPayerId } = req.params
    const deletedTaxpayer = await Taxpayer.findByIdAndDelete(taxPayerId)
    if (!deletedTaxpayer)
      return res.status(404).json({ message: "Taxpayer not found" })

    res.status(200).json({ message: "Taxpayer deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
