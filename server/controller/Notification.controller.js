import Notification from "../models/Notification.js"
import User from "../models/userModel.js"

export const checkTaxSetupAndNotify = async (req, res) => {
  try {
    const userId = req.userId

    // Validate userId exists
    if (!userId) {
      console.log("[Tax Setup] No userId provided")
      return
    }

    const user = await User.findById(userId).select("isTaxSetupComplete email")

    if (!user) {
      console.log(`[Tax Setup] User not found with ID: ${userId}`)
      return
    }

    // Only trigger for non-setup users
    if (user.isTaxSetupComplete) {
      console.log(`[Tax Setup] User ${user.email} already completed tax setup`)
      return
    }

    // Check for existing unread notification in the last 7 days
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const existingNotification = await Notification.findOne({
      recipient: user._id,
      recipientModel: "taxpayer",
      type: "warning",
      message: { $regex: /complete.*tax setup/i },
      read: false,
      createdAt: { $gte: oneWeekAgo },
    })

    if (existingNotification) {
      console.log(
        `[Tax Setup] Recent unread notification already exists for user ${user.email}`
      )
      return
    }

    // Create new notification
    const notification = await Notification.create({
      recipient: user._id,
      recipientModel: "taxpayer",
      type: "warning",
      message: "Please complete your tax setup to access the full dashboard.",
      link: "/user/complete-tax-setup",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    })

    console.log(`[Tax Setup] Notification created for user ${user.email}`, {
      notificationId: notification._id,
      createdAt: notification.createdAt,
    })
  } catch (err) {
    console.error("[Tax Setup] Error in checkTaxSetupAndNotify:", {
      error: err.message,
      stack: err.stack,
      userId: req.userId,
    })
  }
}

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId
    const notifications = await Notification.find({
      recipient: userId,
    })
      .sort({ createdAt: -1 }) // newest first
      .lean() // return plain JS objects, not Mongoose docs

    res.status(200).json({ notifications, success: true })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch notifications.", success: false })
  }
}

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.userId

    await Notification.updateMany(
      {
        recipient: userId,
        read: false,
      },
      { $set: { read: true } }
    )

    res
      .status(200)
      .json({ message: "All notifications marked as read.", success: true })
  } catch (error) {
    res.status(500).json({
      message: "Failed to mark all notifications as read.",
      success: false,
    })
  }
}

export const markNotificationAsRead = async (req, res) => {
  try {
    const userId = req.userId
    const notificationId = req.params.id

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    })

    if (!notification) {
      return res
        .status(404)
        .json({ message: "Notification not found.", success: false })
    }

    notification.read = true
    await notification.save()

    res
      .status(200)
      .json({ message: "Notification marked as read.", success: true })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to mark notification as read.", success: false })
  }
}

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id
    const userId = req.userId

    const notification = await Notification.findById(notificationId)

    if (!notification) {
      return res
        .status(404)
        .json({ success: false, message: "Notification not found" })
    }

    if (!notification.recipient.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this notification",
      })
    }

    await Notification.findByIdAndDelete(notificationId)

    res
      .status(200)
      .json({ success: true, message: "Notification deleted successfully" })
  } catch (err) {
    console.error("Error deleting notification:", err)
    res.status(500).json({ success: false, message: "Server error" })
  }
}
export const createNotification = async (req, res) => {
  try {
    const { recipient, recipientModel, type = "info", message, link } = req.body
    const userId = req.userId

    if (!recipient || !recipientModel || !message) {
      return res.status(400).json({
        success: false,
        message: "Recipient, recipientModel, and message are required.",
      })
    }

    if (!["taxpayer", "official"].includes(recipientModel)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipientModel. Must be 'taxpayer' or 'official'.",
      })
    }

    const newNotification = await Notification.create({
      recipient,
      recipientModel,
      sender: userId,
      type,
      message,
      link,
    })

    return res.status(201).json({
      success: true,
      message: "Notification created successfully.",
      notification: newNotification,
    })
  } catch (error) {
    console.error("Notification creation error:", error)
    return res.status(500).json({
      success: false,
      message: "Server error while creating notification.",
    })
  }
}

export const notifyTaxpayerCompletion = async (userId) => {
  try {
    const user = await User.findById(userId)

    if (!user) {
      throw new Error("user not found")
    }

    const notificationData = {
      message: `New taxpayer (${user.fullName}) completed tax setup. Review their details `,
      sender: user._id,
      type: "success",
    }

    if (user.assignedOfficial) {
      await Notification.create({
        ...notificationData,
        link: `/official/taxpayer`,
        recipient: user.assignedOfficial,
        recipientModel: "official",
      })
    } else {
      const admins = await User.find({ role: "admin" })

      if (admins.length === 0) {
        console.warn("No admins found to notify.")
        return
      }

      const adminNotifications = admins.map((admin) => ({
        ...notificationData,
        link: `/admin/user/${user._id}`,
        recipient: admin._id,
        recipientModel: "admin",
      }))

      await Notification.insertMany(adminNotifications)
    }
  } catch (error) {
    console.error("Error sending completion notification:", error.message)
    throw error
  }
}

export const setupTax = async (userId) => {
  try {
    const user = await User.findById(userId)
    const userRole = user.role

    await Notification.create({
      recipient: userId,
      recipientModel: userRole,
      sender: null,
      type: "success",
      message:
        "Congrats, Your tax setup is complete. You can now manage your tax filings and payments.",
    })
  } catch (error) {
    console.error("Tax setup error:", error)
  }
}
