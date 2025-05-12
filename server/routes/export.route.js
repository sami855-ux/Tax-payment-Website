import express from "express"
import { exportUserToPDF } from "../controller/exportFile.controller.js"

const router = express.Router()

router.get("/:userId", exportUserToPDF)

export default router
