import express from "express"
import { isAuthenticated } from "../controller/user.controller.js"
import {
  createTaxFiling,
  getAllAssignedTaxpayerFilings,
  getApprovedTaxFilingsForUser,
  getPendingTaxFilingsForUser,
  getRecentActivityFeed,
  getRecentTaxFilingTableData,
  getTaxPaymentTrends,
  getTaxTimelineData,
  reviewTaxFiling,
} from "../controller/taxFilling.controller.js"
import upload from "../config/multer.js"
import { getMonthlyTrends } from "../controller/taxPayment.controller.js"

const router = express.Router()

//Create new tax filling
router.post(
  "/create",
  isAuthenticated,
  upload.single("documentFiled"),
  createTaxFiling
)

router.get("/assigned", isAuthenticated, getAllAssignedTaxpayerFilings)
router.post("/review", isAuthenticated, reviewTaxFiling)
router.get("/approved", isAuthenticated, getApprovedTaxFilingsForUser)
router.get("/getPaymentTrend", isAuthenticated, getTaxPaymentTrends)
router.get("/pending", isAuthenticated, getPendingTaxFilingsForUser)
router.get("/timeline", isAuthenticated, getTaxTimelineData)
router.get("/dashboard/activity-feed", getRecentActivityFeed)
router.get("/adminDashboard", isAuthenticated, getRecentTaxFilingTableData)
router.get("/dashboard/monthly-trend", isAuthenticated, getMonthlyTrends)

export default router
