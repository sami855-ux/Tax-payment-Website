import bcrypt from "bcryptjs"
import { validationResult } from "express-validator"

import Taxpayer from "../models/userModel.js"

// Register Taxpayer
export const registerTaxpayer = async (req, res) => {
  try {
    // Validate request data
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

    // Check if the email or tax ID already exists
    const existingUser = await Taxpayer.findOne({
      $or: [{ emailAddress }, { taxId }],
    })
    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or Tax ID already registered" })

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new taxpayer
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
    res.status(201).json({ message: "Taxpayer registered successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Login Taxpayer
export const loginTaxpayer = async (req, res) => {
  try {
    const { emailAddress, password } = req.body

    // Find user by email
    const taxpayer = await Taxpayer.findOne({ emailAddress })
    if (!taxpayer)
      return res.status(400).json({ message: "Invalid email or password" })

    // Compare passwords
    const isMatch = await bcrypt.compare(password, taxpayer.password)
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" })

    // Store user session
    req.session.user = { id: taxpayer._id, email: taxpayer.emailAddress }
    res
      .status(200)
      .json({ message: "Login successful", user: req.session.user })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Middleware to Check Authentication
export const isAuthenticated = (req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized, please log in" })
  next()
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
