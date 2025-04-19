import express from "express"
import {
  deleteTaxpayer,
  getAllTaxpayers,
  isAuthenticated,
  loginTaxpayer,
  registerTaxpayer,
  updateTaxpayer,
} from "../controller/user.controller.js"

const router = express.Router()

//To register
router.post("/register", registerTaxpayer)
// To Login
router.get("/login", loginTaxpayer)
// To get all tax payers
router.get("/", isAuthenticated, getAllTaxpayers)
//To update tax payer using id
router.put("/:taxPayerId", isAuthenticated, updateTaxpayer)
//To delete tax payer
router.delete("/:taxPayerId", isAuthenticated, deleteTaxpayer)

export default router
