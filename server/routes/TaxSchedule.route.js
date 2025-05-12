import express from "express"

import { isAuthenticated } from "../controller/user.controller.js"
import {
  getFiledPeriods,
  getFiledTaxSchedules,
  getPendingTaxSchedules,
  sendUserTaxReminders,
} from "../controller/TaxSchedule.controller.js"

const router = express.Router()

router.get("/reminders", isAuthenticated, sendUserTaxReminders)
router.get("/pendingTax", isAuthenticated, getPendingTaxSchedules)
router.get("/filed", isAuthenticated, getFiledTaxSchedules)
router.get("/filled-period", isAuthenticated, getFiledPeriods)

export default router
