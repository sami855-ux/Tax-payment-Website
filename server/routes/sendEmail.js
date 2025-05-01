import express from "express"
import sendEmail from "../controller/emailSender.controller.js"

const router = express.Router()

router.post("/send", sendEmail)

export default router
