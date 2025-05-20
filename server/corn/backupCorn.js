import cron from "node-cron"
import fs from "fs"
import path from "path"
import zlib from "zlib"

import User from "../models/userModel.js"
import TaxFilling from "../models/TaxFilling.js"
import Notification from "../models/Notification.js"
import Payment from "../models/TaxPayment.js"
import TaxRule from "../models/TaxRule.js"
import TaxSchedule from "../models/TaxSchedule.js"

export const startBackupScheduler = () => {
  // Run every hour (adjust as needed)
  cron.schedule("0 * * * *", async () => {
    const now = new Date()

    // Find users with backup scheduled
    const users = await User.find({
      "backupSettings.nextBackup": { $lte: now },
    })

    for (const user of users) {
      try {
        // Fetch all data for backup
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

        // Prepare user's backup folder
        const dir = path.join("backups", user._id.toString())
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

        const filename = `backup-${Date.now()}.json`
        const filePath = path.join(dir, filename)

        fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2), "utf8")

        // Compress
        const gzip = zlib.createGzip()
        const input = fs.createReadStream(filePath)
        const output = fs.createWriteStream(filePath + ".gz")
        input.pipe(gzip).pipe(output)

        await new Promise((resolve) => output.on("finish", resolve))
        fs.unlinkSync(filePath)

        // Set next backup
        const next = getNextBackupDate(user.backupSettings.frequency)
        user.backupSettings.nextBackup = next
        await user.save()

        console.log(`✅ Backup complete for ${user.email}`)
      } catch (err) {
        console.error(`❌ Backup failed for ${user.email}:`, err)
      }
    }
  })
}

function getNextBackupDate(frequency) {
  const next = new Date()
  if (frequency === "daily") next.setDate(next.getDate() + 1)
  if (frequency === "weekly") next.setDate(next.getDate() + 7)
  if (frequency === "monthly") next.setMonth(next.getMonth() + 1)
  next.setHours(2, 0, 0, 0)
  return next
}
