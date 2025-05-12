import express from "express"
import { isAuthenticated } from "../controller/user.controller.js"
import {
  checkTaxSetupAndNotify,
  createNotification,
  deleteNotification,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  notifyTaxpayerCompletion,
} from "../controller/Notification.controller.js"

const router = express.Router()

router.get("/checkTaxSetup", isAuthenticated, checkTaxSetupAndNotify)
router.get("/getUserNotification", isAuthenticated, getUserNotifications)
router.patch("/read-all", isAuthenticated, markAllNotificationsAsRead)
router.patch("/:id/read", isAuthenticated, markNotificationAsRead)
router.delete("/:id", isAuthenticated, deleteNotification)
router.post("/", isAuthenticated, createNotification)
router.post("/notify", isAuthenticated, notifyTaxpayerCompletion)

export default router
