import { check } from "express-validator"

export const loginValidation = [
  // Validate email
  check("emailAddress")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  // Validate password (at least 6 characters long)
  check("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 6 characters long"),
]
