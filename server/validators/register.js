import { check } from "express-validator"

export const registerValidation = [
  check("email")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  check("password")
    .isLength({ min: 2 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter"),

  check("fullName")
    .isLength({ min: 2 })
    .withMessage("Full Name must be at least 2 characters long")
    .trim()
    .escape(),

  check("phoneNumber")
    .isMobilePhone()
    .withMessage("Please provide a valid phone number")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number should be exactly 10 digits"),

  check("taxId")
    .isLength({ min: 10, max: 10 })
    .withMessage("Tax ID must be 10 digits long")
    .isNumeric()
    .withMessage("Tax ID must be numeric"),

  check("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),

  check("kebele")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Kebele must be at least 3 characters long"),

  check("wereda")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Wereda must be at least 3 characters long"),

  check("role")
    .optional()
    .isIn(["taxpayer", "admin"])
    .withMessage("Role must be either taxpayer or admin"),
]
