import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  Bell,
  BellRing,
  AlertCircle,
  CheckCircle2,
  Info,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchNotifications,
  markNotificationAsRead,
  removeNotification,
} from "@/redux/slice/notificationSlice"
import { markAllNotificationsRead } from "@/services/notification"
import { formatDistanceToNowStrict, isValid, parseISO } from "date-fns"
import { Spinner } from "@radix-ui/themes"

const NotificationAdmin = () => {
  const { loading, items } = useSelector((store) => store.notification)
  const dispatch = useDispatch()

  const [notifications, setNotifications] = useState(items)
  const [unreadCount, setUnreadCount] = useState(0)
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState("all")

  // Calculate unread count
  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  // Filter notifications
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return notification.type === filter
  })

  // Mark as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n._id === id ? { ...n, read: true } : n))
    )

    dispatch(markNotificationAsRead(id))
  }

  // Mark all as read
  const markAllAsRead = async () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    await markAllNotificationsRead()
  }

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n._id !== id))
    dispatch(removeNotification(id))
  }

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="text-amber-500" size={20} />
      case "success":
        return <CheckCircle2 className="text-emerald-500" size={20} />
      case "reminder":
        return <BellRing className="text-amber-500" size={20} />
      default:
        return <Info className="text-amber-500" size={20} />
    }
  }

  // Format time
  const formatTime = (date) => {
    const parsedDate =
      typeof date === "string" ? parseISO(date) : new Date(date)

    if (!isValid(parsedDate)) return "Invalid date"

    const diff = formatDistanceToNowStrict(parsedDate, {
      addSuffix: true,
    })

    return diff
  }

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  if (loading) return <Spinner />

  return (
    <div className="w-full py-6 px-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 flex items-center gap-5 pb-5"
        >
          <Bell className="text-amber-600" size={34} />
          <h2 className="text-3xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-amber-100 text-amber-800 text-sm font-medium px-4 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </motion.h1>

        <div className="flex gap-3">
          <button
            onClick={markAllAsRead}
            className="text-sm text-amber-600 cursor-pointer  hover:text-amber-800 hover:font-semibold font-medium"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "unread", "warning", "reminder", "success", "info"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-7 py-2 text-[15px] cursor-pointer font-medium rounded-full whitespace-nowrap transition-colors ${
                filter === type
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500"
            >
              No notifications found
            </motion.div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`rounded-xl shadow-sm border overflow-hidden ${
                  !notification.read
                    ? "bg-amber-50/30 border-amber-100"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="p-4">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3
                          className={`font-medium ${
                            !notification.read
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {notification.message}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setExpandedId(
                                expandedId === notification._id
                                  ? null
                                  : notification._id
                              )
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {expandedId === notification._id ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.createdAt)}
                        </span>

                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === notification._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          {notification.link ? (
                            <a
                              href={notification.link}
                              className="inline-block px-3 py-1.5 text-sm bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100"
                            >
                              View details
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No action available
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NotificationAdmin
