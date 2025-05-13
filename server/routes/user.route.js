import express from "express"
import {
  assignOfficialToTaxpayer,
  // assignOfficialToTaxpayer,
  changeUserRole,
  completeTaxSetup,
  deleteTaxpayer,
  getAllOfficials,
  getAllUser,
  getTaxpayersByOfficial,
  // getTaxpayersByOfficial,
  getUserById,
  increaseNoticesSent,
  isAuthenticated,
  login,
  logoutUser,
  register,
  updateUserById,
} from "../controller/user.controller.js"

import { registerValidation } from "../validators/register.js"
import { loginValidation } from "../validators/login.js"

import upload from "../config/multer.js"

const router = express.Router()

//! assign official to taxpayer => Admin
router.patch("/assign", isAuthenticated, assignOfficialToTaxpayer)

router.patch("/:taxpayerId/increase-notice", increaseNoticesSent)

router.get("/official", getAllOfficials)
// get all taxpayer for officials
router.get("/get-taxpayer", isAuthenticated, getTaxpayersByOfficial)
//To register
router.post("/register", registerValidation, register)
// To Login
router.post("/login", loginValidation, login)
// To get all users
router.get("/", isAuthenticated, getAllUser)
//To delete tax payer
router.delete("/:userId", isAuthenticated, deleteTaxpayer)
//Get user by id
router.get("/:userId", isAuthenticated, getUserById)
//Update user by id
router.patch(
  "/:userId",
  isAuthenticated,
  upload.single("profilePicture"),
  updateUserById
)
//To logout the user
router.post("/logout", logoutUser)
// PATCH /api/users/:id/role => verify the user is admin and authenticated
router.patch("/role/:id", isAuthenticated, changeUserRole)
//complete tax setup
router.post("/tax-setup", isAuthenticated, completeTaxSetup)

// get all official

export default router
