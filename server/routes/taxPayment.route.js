import express from "express"
import {
  approvePayment,
  createPayment,
  getAllPaymentsForUser,
  getPaymentsForOfficial,
} from "../controller/taxPayment.controller.js"
import { isAuthenticated } from "../controller/user.controller.js"
import upload from "../config/multer.js"

const router = express.Router()

// Route to create a payment
router.post(
  "/create",
  isAuthenticated,
  upload.single("paymentReceiptImage"),
  createPayment
)

//get all payment for the user
router.get("/getall", isAuthenticated, getAllPaymentsForUser)

//Get payments for the user
router.get("/getassigned-payment", isAuthenticated, getPaymentsForOfficial)

router.put("/approve/:paymentId", isAuthenticated, approvePayment)

export default router
