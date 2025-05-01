import express from "express"
import {
  changeUserRole,
  deleteTaxpayer,
  getAllUser,
  getUserById,
  isAuthenticated,
  login,
  logoutUser,
  register,
  updateUserById,
} from "../controller/user.controller.js"

import { registerValidation } from "../validators/register.js"
import { loginValidation } from "../validators/login.js"

const router = express.Router()

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
router.patch("/:userId", isAuthenticated, updateUserById)
//To logout the user
router.post("/logout", logoutUser)
// PATCH /api/users/:id/role => verify the user is admin and authenticated
router.patch("/role/:id", isAuthenticated, changeUserRole)

export default router
