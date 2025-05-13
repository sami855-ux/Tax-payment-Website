import express from "express"

import {
  createTaxRule,
  deleteTaxRule,
  getAllTaxRules,
  updateTaxRule,
} from "../controller/taxRule.controller.js"
import { isAuthenticated } from "../controller/user.controller.js"

const router = express.Router()

router.post("/create", isAuthenticated, createTaxRule)
router.get("/", isAuthenticated, getAllTaxRules)
router.patch("/:id", isAuthenticated, updateTaxRule)
router.delete("/:id", isAuthenticated, deleteTaxRule)

export default router
