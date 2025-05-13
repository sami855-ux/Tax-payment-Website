import express from "express"
import { isAuthenticated } from "../controller/user.controller.js"
import {
  createTaxFiling,
  getAllAssignedTaxpayerFilings,
  reviewTaxFiling,
} from "../controller/taxFilling.controller.js"

const router = express.Router()

router.post("/create", isAuthenticated, createTaxFiling)
router.get("/assigned", isAuthenticated, getAllAssignedTaxpayerFilings)
router.post("/review", isAuthenticated, reviewTaxFiling)

export default router
