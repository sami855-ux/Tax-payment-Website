// routes/backupRoutes.js
import express from "express"
import fs from "fs"
import path from "path"
import zlib from "zlib"
import multer from "multer"

import User from "../models/userModel.js"
import TaxFilling from "../models/TaxFilling.js"
import Notification from "../models/Notification.js"
import Payment from "../models/TaxPayment.js"
import TaxRule from "../models/TaxRule.js"
import TaxSchedule from "../models/TaxSchedule.js"
import { isAuthenticated } from "../controller/user.controller.js"

const router = express.Router()

router.get("/download", isAuthenticated, async (req, res) => {
  try {
    // Step 1: Create a backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), "backups")
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Step 2: Fetch all data from the database
    const users = await User.find({})
    const taxFilings = await TaxFilling.find({})
    const notifications = await Notification.find({})
    const taxPayments = await Payment.find({})
    const taxRules = await TaxRule.find({})
    const taxSchedules = await TaxSchedule.find({})

    const backupData = {
      users,
      taxFilings,
      notifications,
      taxPayments,
      taxRules,
      taxSchedules,
      backupTime: new Date().toISOString(),
    }

    // Step 3: Save as a raw JSON file
    const rawFileName = `backup-${Date.now()}.json`
    const rawFilePath = path.join(backupDir, rawFileName)
    fs.writeFileSync(rawFilePath, JSON.stringify(backupData, null, 2), "utf8")

    // Step 4: Compress the file using gzip
    const compressedPath = `${rawFilePath}.gz`
    const gzip = zlib.createGzip()
    const input = fs.createReadStream(rawFilePath)
    const output = fs.createWriteStream(compressedPath)

    input.pipe(gzip).pipe(output)

    await Notification.create({
      recipient: req.userId,
      recipientModel: "admin",
      type: "info",
      message: "Backup completed successfully",
    })
    output.on("finish", () => {
      // Step 5: Delete raw JSON after compression
      fs.unlinkSync(rawFilePath)

      // Step 6: Send the .gz file to the user
      return res.download(
        compressedPath,
        path.basename(compressedPath),
        (err) => {
          if (err) {
            console.error("Download failed:", err)
            return res
              .status(500)
              .json({ success: false, message: "Download failed." })
          }

          fs.unlinkSync(compressedPath)
        }
      )
    })
  } catch (err) {
    console.error("❌ Backup error:", err)
    res
      .status(500)
      .json({ success: false, message: "Backup failed. Try again later." })
  }
})

// Configure multer to accept .gz files
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith(".gz")) cb(null, true)
    else cb(new Error("Only .gz files allowed"), false)
  },
})

router.post(
  "/restore",
  upload.single("backup"),
  isAuthenticated,
  async (req, res) => {
    try {
      const uploadedPath = req.file.path
      const uncompressedPath = `${uploadedPath}.json`

      // Unzip the file
      const unzip = zlib.createGunzip()
      const input = fs.createReadStream(uploadedPath)
      const output = fs.createWriteStream(uncompressedPath)

      input.pipe(unzip).pipe(output)

      output.on("finish", async () => {
        const raw = fs.readFileSync(uncompressedPath, "utf8")
        const data = JSON.parse(raw)

        await Promise.all([
          User.deleteMany({}),
          TaxFilling.deleteMany({}),
          Notification.deleteMany({}),
          Payment.deleteMany({}),
          TaxRule.deleteMany({}),
          TaxSchedule.deleteMany({}),
        ])

        await User.insertMany(data.users)
        await TaxFilling.insertMany(data.taxFilings)
        await Notification.insertMany(data.notification)
        await Payment.insertMany(data.taxPayment)
        await TaxRule.insertMany(data.taxRule)
        await TaxSchedule.insertMany(data.taxSchedule)

        fs.unlinkSync(uploadedPath)
        fs.unlinkSync(uncompressedPath)

        await Notification.create({
          recipient: req.userId,
          recipientModel: "admin",
          type: "info",
          message: "Restore completed successfully",
        })

        res.json({ success: true, message: "Database restored successfully!" })
      })
    } catch (err) {
      console.error("Restore failed:", err)
      res.status(500).json({ success: false, message: "Restore failed." })
    }
  }
)
router.post("/backup-frequency", isAuthenticated, async (req, res) => {
  const { frequency } = req.body
  try {
    const next = calculateNextBackup(new Date(), frequency)
    await User.findByIdAndUpdate(req.userId, {
      "backupSettings.frequency": frequency,
      "backupSettings.nextBackup": next,
    })
    await Notification.create({
      recipient: req.userId,
      recipientModel: "admin",
      type: "info",
      message: "Backup frequency updated",
    })
    res.json({ success: true, nextBackup: next })
  } catch (err) {
    console.error("Error updating backup frequency", err)
    res.status(500).json({ success: false, message: "Update failed" })
  }
})

function calculateNextBackup(fromDate, frequency) {
  const next = new Date(fromDate)
  if (frequency === "daily") next.setDate(next.getDate() + 1)
  else if (frequency === "weekly") next.setDate(next.getDate() + 7)
  else if (frequency === "monthly") next.setMonth(next.getMonth() + 1)
  next.setHours(2, 0, 0, 0) // Set to 2:00 AM
  return next
}

export default router
