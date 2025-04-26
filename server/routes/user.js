import express from "express"
import {
  deleteTaxpayer,
  getAllTaxpayers,
  isAuthenticated,
  login,
  register,
  updateTaxpayer,
} from "../controller/user.controller.js"

import { registerValidation } from "../validators/register.js"
import { loginValidation } from "../validators/login.js"

const router = express.Router()

//To register
router.post("/register", registerValidation, register)
// To Login
router.get("/login", loginValidation, login)
// To get all tax payers
router.get("/", isAuthenticated, getAllTaxpayers)
//To update tax payer using id
router.put("/:taxPayerId", isAuthenticated, updateTaxpayer)
//To delete tax payer
router.delete("/:taxPayerId", isAuthenticated, deleteTaxpayer)

export default router
