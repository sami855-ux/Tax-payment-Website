import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiUser,
  FiLock,
  FiBell,
  FiActivity,
  FiCheck,
  FiUpload,
  FiEdit,
  FiX,
  FiCamera,
} from "react-icons/fi"
import toast from "react-hot-toast"

const OfficialSettings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState({
    name: "John TaxOfficer",
    email: "john.tax@government.gov",
    phone: "+1 234 567 8900",
    role: "Senior Tax Auditor",
    department: "Income Tax Department",
    officeLocation: "Central Tax Building, Floor 5",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    smsEnabled: false,
    newPayment: true,
    overdueTaxpayer: true,
    systemUpdates: false,
  })
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(
    "https://randomuser.me/api/portraits/men/32.jpg"
  )
  const [activityLog, setActivityLog] = useState([])

  // Load sample activity log
  useEffect(() => {
    setActivityLog([
      {
        id: 1,
        action: "Logged in",
        timestamp: "2023-06-15T09:30:00",
        ip: "192.168.1.1",
      },
      {
        id: 2,
        action: "Updated profile",
        timestamp: "2023-06-14T14:25:00",
        ip: "192.168.1.1",
      },
      {
        id: 3,
        action: "Approved payment TXP123",
        timestamp: "2023-06-14T11:15:00",
        ip: "192.168.1.1",
      },
      {
        id: 4,
        action: "Logged in",
        timestamp: "2023-06-13T08:45:00",
        ip: "192.168.1.1",
      },
    ])
  }, [])

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB")
        return
      }
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file))
      toast.success("Profile picture updated!")
    }
  }

  // Handle profile update
  const handleProfileUpdate = (e) => {
    e.preventDefault()
    toast.success("Profile updated successfully!")
  }

  // Handle password change
  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }
    toast.success("Password changed successfully!")
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  // Handle notification toggle
  const toggleNotification = (field) => {
    setNotifications((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
    toast.success("Notification preference updated!")
  }

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Official Settings
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="w-full md:w-64 bg-white rounded-lg shadow p-4 h-fit"
          >
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "profile"
                    ? "bg-emerald-50 text-emerald-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FiUser className="mr-3" />
                Profile Info
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "password"
                    ? "bg-emerald-50 text-emerald-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FiLock className="mr-3" />
                Password
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "notifications"
                    ? "bg-emerald-50 text-emerald-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FiBell className="mr-3" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${
                  activeTab === "activity"
                    ? "bg-emerald-50 text-emerald-600"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <FiActivity className="mr-3" />
                Activity Log
              </button>
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabVariants}
            transition={{ duration: 0.2 }}
            className="flex-1 bg-white rounded-lg shadow p-6"
          >
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Profile Information
                  </h2>

                  {/* Profile Picture Section */}
                  <div className="flex flex-col items-center space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="relative group"
                    >
                      <img
                        src={previewImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-emerald-100 shadow-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label
                          htmlFor="profile-upload"
                          className="cursor-pointer"
                        >
                          <FiCamera className="text-white text-2xl" />
                        </label>
                      </div>
                    </motion.div>
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() =>
                        document.getElementById("profile-upload").click()
                      }
                      className="flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <FiUpload className="mr-2" />
                      Change Photo
                    </button>
                  </div>

                  {/* Profile Form */}
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <input
                          type="text"
                          value={profileData.role}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              role: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={profileData.department}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              department: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Office Location
                        </label>
                        <input
                          type="text"
                          value={profileData.officeLocation}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              officeLocation: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <FiCheck className="mr-2" />
                        Save Profile
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === "password" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Change Password
                  </h2>
                  <form
                    onSubmit={handlePasswordChange}
                    className="space-y-4 max-w-md"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                        minLength="8"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Minimum 8 characters
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                      />
                    </div>
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                      >
                        <FiCheck className="mr-2" />
                        Change Password
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          Email Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification("emailEnabled")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                          notifications.emailEnabled
                            ? "bg-emerald-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.emailEnabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          SMS Notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                          Receive notifications via text message
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification("smsEnabled")}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                          notifications.smsEnabled
                            ? "bg-emerald-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.smsEnabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium text-gray-800">
                        Notification Types
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">
                            New Payment Received
                          </span>
                          <button
                            onClick={() => toggleNotification("newPayment")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                              notifications.newPayment
                                ? "bg-emerald-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.newPayment
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">
                            Overdue Taxpayer
                          </span>
                          <button
                            onClick={() =>
                              toggleNotification("overdueTaxpayer")
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                              notifications.overdueTaxpayer
                                ? "bg-emerald-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.overdueTaxpayer
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">System Updates</span>
                          <button
                            onClick={() => toggleNotification("systemUpdates")}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                              notifications.systemUpdates
                                ? "bg-emerald-600"
                                : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.systemUpdates
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "activity" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Activity Log
                  </h2>
                  <div className="space-y-4">
                    {activityLog.map((log) => (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">
                              {log.action}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                            IP: {log.ip}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OfficialSettings
