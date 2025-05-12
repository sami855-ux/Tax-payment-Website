import TaxSchedule from "../models/TaxSchedule.js"
import Notification from "../models/Notification.js"
import User from "../models/userModel.js"

export const generateInitialSchedules = async (userId) => {
  try {
    // 1. Fetch user and tax categories
    const user = await User.findById(userId)

    if (!user || !user.taxCategories || user.taxCategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No tax categories found for taxpayer.",
      })
    }

    const schedules = []
    const now = new Date()

    for (const categoryName of user.taxCategories) {
      // 2. Determine frequency for this category
      const categoryDetails = user.taxDetails?.[categoryName]
      if (!categoryDetails) continue

      let frequency = "yearly" // default fallback

      if (categoryName === "vat") {
        frequency = "monthly"
      } else if (categoryName === "personal") {
        frequency = "yearly"
      } else if (categoryName === "business") {
        frequency = "quarterly"
      } else if (categoryName === "property") {
        frequency = "yearly"
      }

      // 3. Define period
      let periodStart = new Date(now)
      let periodEnd = new Date(now)
      let dueDate = new Date(now)

      if (frequency === "monthly") {
        periodEnd.setMonth(periodEnd.getMonth() + 1)
      } else if (frequency === "quarterly") {
        periodEnd.setMonth(periodEnd.getMonth() + 3)
      } else if (frequency === "yearly") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1)
      }

      dueDate = new Date(periodEnd)

      // 4. Check for existing schedule in current period
      const exists = await TaxSchedule.findOne({
        taxpayer: userId,
        taxCategory: categoryName,
        periodStart: { $lte: now },
        periodEnd: { $gte: now },
      })

      if (exists) continue

      // 5. Create schedule
      const schedule = await TaxSchedule.create({
        taxpayer: userId,
        taxCategory: categoryName,
        periodStart,
        periodEnd,
        dueDate,
      })

      schedules.push(schedule)

      // 6. Notify user
      await Notification.create({
        recipient: userId,
        recipientModel: "taxpayer",
        type: "info",
        message: `Your ${categoryName} tax is scheduled (${frequency}). Due by ${dueDate.toDateString()}.`,
        link: "/dashboard/filings",
      })
    }

    return
  } catch (error) {
    console.error("Schedule generation error:", error)
  }
}

export const sendUserTaxReminders = async (req, res) => {
  try {
    const taxpayerId = req.userId
    const now = new Date()
    const threeDaysLater = new Date()
    threeDaysLater.setDate(now.getDate() + 3)

    // Get upcoming due taxes for this user
    const schedules = await TaxSchedule.find({
      taxpayer: taxpayerId,
      dueDate: { $gte: now, $lte: threeDaysLater },
      reminderSent: false,
    })

    if (schedules.length === 0) {
      return res.status(200).json({ message: "No upcoming tax reminders." })
    }

    for (const schedule of schedules) {
      // Send a notification
      await Notification.create({
        recipient: taxpayerId,
        recipientModel: "taxpayer",
        type: "reminder",
        message: `Reminder: Your ${
          schedule.taxCategory
        } tax is due on ${schedule.dueDate.toDateString()}.`,
        link: "/dashboard/filings",
      })

      // Mark the reminder as sent
      schedule.reminderSent = true
      await schedule.save()
    }

    res.status(200).json({
      message: `${schedules.length} reminders sent.`,
      count: schedules.length,
    })
  } catch (error) {
    console.error("Reminder error:", error)
    res.status(500).json({ message: "Failed to send tax reminders." })
  }
}

export const getPendingTaxSchedules = async (req, res) => {
  try {
    const taxpayerId = req.userId
    console.log(taxpayerId)

    const pendingSchedules = await TaxSchedule.find({
      taxpayer: taxpayerId,
      status: "pending",
    }).sort({ dueDate: 1 })

    if (pendingSchedules.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No pending tax schedules found.",
        schedules: [],
      })
    }

    res.status(200).json({
      success: true,
      message: "Pending tax schedules fetched successfully.",
      schedules: pendingSchedules,
    })
  } catch (error) {
    console.error("Error fetching pending tax schedules:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending tax schedules.",
    })
  }
}

export const getFiledTaxSchedules = async (req, res) => {
  try {
    const taxpayerId = req.userId

    const filedSchedules = await TaxSchedule.find({
      taxpayer: taxpayerId,
      status: "filed",
    }).sort({ dueDate: -1 })

    return res.status(200).json({
      success: true,
      message:
        filedSchedules.length > 0
          ? "Filed tax schedules retrieved successfully."
          : "No filed tax schedules found for this user.",
      count: filedSchedules.length,
      schedules: filedSchedules,
    })
  } catch (error) {
    console.error("Error fetching filed tax schedules:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to fetch filed tax schedules.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

export const getFiledPeriods = async (req, res) => {
  try {
    const userId = req.userId
    const filedSchedules = await TaxSchedule.find({
      taxpayer: userId,
      status: { $in: ["filed", "paid"] },
    }).select("taxCategory periodStart periodEnd")

    res.status(200).json({
      success: true,
      filings: filedSchedules,
    })
  } catch (error) {
    console.error("Error fetching filed periods:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch filed periods",
    })
  }
}
