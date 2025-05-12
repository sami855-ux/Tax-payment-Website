import express from "express"

import { createTaxRule } from "../controller/taxRule.controller.js"
import { isAuthenticated } from "../controller/user.controller.js"

const router = express.Router()

router.post("/create", isAuthenticated, createTaxRule)

export default router
