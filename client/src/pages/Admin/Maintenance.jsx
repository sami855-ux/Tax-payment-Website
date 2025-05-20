import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  FiDownload,
  FiUpload,
  FiClock,
  FiCalendar,
  FiActivity,
  FiAlertCircle,
  FiCheckCircle,
  FiDatabase,
  FiServer,
  FiHardDrive,
} from "react-icons/fi"
import axios from "axios"
import toast from "react-hot-toast"

const Maintenance = () => {
  const [activeTab, setActiveTab] = useState("backup")
  const [backupStatus, setBackupStatus] = useState({
    lastBackup: "2023-06-15 14:30",
    size: "2.4 GB",
    inProgress: false,
  })
  const [restoreFile, setRestoreFile] = useState(null)
  const [schedule, setSchedule] = useState("daily")
  const [logs, setLogs] = useState([])
  const [isRestoring, setIsRestoring] = useState(false)
  const [systemHealth, setSystemHealth] = useState({
    mongoDB: "healthy",
    api: "healthy",
    storage: "healthy",
  })

  // Mock data for logs
  useEffect(() => {
    setLogs([
      {
        id: 1,
        date: "2023-06-15 14:30",
        user: "admin",
        action: "Manual backup",
        details: "Backup completed successfully",
      },
      {
        id: 2,
        date: "2023-06-15 10:15",
        user: "admin",
        action: "Login",
        details: "Successful login",
      },
      {
        id: 3,
        date: "2023-06-14 22:05",
        user: "system",
        action: "Auto backup",
        details: "Daily backup completed",
      },
      {
        id: 4,
        date: "2023-06-14 18:30",
        user: "admin",
        action: "Data access",
        details: "Accessed taxpayer records",
      },
    ])
  }, [])

  const handleFileChange = (e) => {
    setRestoreFile(e.target.files[0])
  }

  const handleBackup = async () => {
    setBackupStatus((prev) => ({ ...prev, inProgress: true }))

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/backup/download`,
        {
          responseType: "blob",
        }
      )

      const blob = new Blob([res.data], { type: "application/gzip" })
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `backup-${new Date().toISOString()}.gz`
      a.click()

      window.URL.revokeObjectURL(url)
    } catch (err) {
      toast.error("Backup failed. Please check the server logs.")
    } finally {
      setBackupStatus({
        lastBackup: new Date().toISOString(),
        size: "2.5 GB",
        inProgress: false,
      })
    }
  }

  const handleRestore = async () => {
    if (!restoreFile) {
      alert("Please select a backup file first!")
      return
    }

    const formData = new FormData()
    formData.append("backup", restoreFile)

    try {
      setIsRestoring(true)
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/backup/restore`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 5 * 60 * 1000, // 5 min timeout for big restores
        }
      )

      toast.success("Restore successful!")
    } catch (error) {
      console.error("Restore failed:", error)
      toast.error("Restore failed. Check server logs.")
    } finally {
      setIsRestoring(false)
      setRestoreFile(null)
    }
  }

  const handleSaveSchedule = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/backup/backup-frequency`,
        { frequency: schedule },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (res.data.success) {
        toast.success(
          ` Backup frequency updated. Next backup: ${new Date(
            res.data.nextBackup
          ).toLocaleString()}`
        )
      } else {
        toast.error(" Failed to update backup frequency.")
      }
    } catch (err) {
      console.error("Error updating backup frequency", err)
      toast.error(" Error updating backup frequency. ")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Database Administration
        </h1>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-gray-200">
          {[
            { id: "backup", label: "Manual Backup" },
            { id: "restore", label: "Restore Backup" },
            { id: "schedule", label: "Auto Backup" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 border-t border-l border-r border-gray-200"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          {/* Manual Backup */}
          {activeTab === "backup" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FiDownload size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Manual Database Backup
                </h2>
              </div>

              <p className="text-gray-600">
                Create an on-demand backup of the entire database including
                taxpayers, payments, filings, etc.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBackup}
                disabled={backupStatus.inProgress}
                className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 ${
                  backupStatus.inProgress
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {backupStatus.inProgress ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Backing Up...</span>
                  </>
                ) : (
                  <>
                    <FiDownload />
                    <span>Backup Now</span>
                  </>
                )}
              </motion.button>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiClock />
                    <span className="font-medium">Last Backup:</span>
                  </div>
                  <div className="text-lg font-semibold mt-1">
                    {backupStatus.lastBackup}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiDatabase />
                    <span className="font-medium">Backup Size:</span>
                  </div>
                  <div className="text-lg font-semibold mt-1">
                    {backupStatus.size}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Restore Backup */}
          {activeTab === "restore" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FiUpload size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Restore Database Backup
                </h2>
              </div>

              <p className="text-gray-600">
                Upload a .bson or .gz file to restore a previous database
                snapshot. This will overwrite current data.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <FiUpload className="text-gray-400" size={32} />
                  <p className="text-gray-500">
                    Drag and drop your backup file here, or click to browse
                  </p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".gz"
                    className="hidden"
                    id="backup-upload"
                  />
                  <label
                    htmlFor="backup-upload"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 cursor-pointer transition-colors"
                  >
                    Select File
                  </label>
                  {restoreFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center space-x-2 text-sm text-gray-700"
                    >
                      <FiCheckCircle className="text-green-500" />
                      <span>{restoreFile.name}</span>
                      <span className="text-gray-500">
                        ({(restoreFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRestore}
                disabled={!restoreFile}
                className={`px-6 py-3 rounded-lg font-medium flex items-center space-x-2 ${
                  !restoreFile
                    ? "bg-purple-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white`}
              >
                <FiAlertCircle />
                <span className="px-4">
                  {" "}
                  {isRestoring ? "Restoring..." : "Restore Backup"}
                </span>
              </motion.button>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Warning:</strong> Restoring a backup will
                      overwrite all current data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Auto Backup Schedule */}
          {activeTab === "schedule" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FiCalendar size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Automatic Backup Schedule
                </h2>
              </div>

              <p className="text-gray-600">
                Configure how often automatic backups should occur.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="schedule"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Backup Frequency
                  </label>
                  <select
                    id="schedule"
                    value={schedule}
                    onChange={(e) => setSchedule(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiClock />
                    <span className="font-medium">Next Backup:</span>
                  </div>
                  <div className="text-lg font-semibold mt-1">
                    Tomorrow at 2:00 AM
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveSchedule}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium text-white"
              >
                Save Schedule
              </motion.button>
            </div>
          )}

          {/* System Logs */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                  <FiActivity size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  System Logs
                </h2>
              </div>

              <p className="text-gray-600">
                View system activity including login attempts, backup
                operations, and data access events.
              </p>

              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <label
                    htmlFor="date-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="user-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    User
                  </label>
                  <select
                    id="user-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Users</option>
                    <option value="admin">Admin</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="action-filter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Action
                  </label>
                  <select
                    id="action-filter"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">All Actions</option>
                    <option value="login">Login</option>
                    <option value="backup">Backup</option>
                    <option value="data-access">Data Access</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log) => (
                      <motion.tr
                        key={log.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileHover={{
                          backgroundColor: "rgba(249, 250, 251, 1)",
                        }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {log.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.action}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {log.details}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* System Health */}
          {activeTab === "health" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FiServer size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  System Health Monitor
                </h2>
              </div>

              <p className="text-gray-600">
                Current status of key system services and resources.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white border rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-3 rounded-full ${
                          systemHealth.mongoDB === "healthy"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        <FiDatabase size={20} />
                      </div>
                      <h3 className="font-medium text-gray-800">MongoDB</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        systemHealth.mongoDB === "healthy"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {systemHealth.mongoDB === "healthy" ? "Healthy" : "Down"}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Uptime</span>
                      <span className="font-medium">99.98%</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Version</span>
                      <span className="font-medium">5.0.8</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Connections</span>
                      <span className="font-medium">24/50</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white border rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-3 rounded-full ${
                          systemHealth.api === "healthy"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        <FiServer size={20} />
                      </div>
                      <h3 className="font-medium text-gray-800">API Service</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        systemHealth.api === "healthy"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {systemHealth.api === "healthy" ? "Healthy" : "Down"}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Response Time</span>
                      <span className="font-medium">128ms</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Requests</span>
                      <span className="font-medium">1,248/min</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Errors</span>
                      <span className="font-medium">0.02%</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-white border rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-3 rounded-full ${
                          systemHealth.storage === "healthy"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        <FiHardDrive size={20} />
                      </div>
                      <h3 className="font-medium text-gray-800">Storage</h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        systemHealth.storage === "healthy"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {systemHealth.storage === "healthy"
                        ? "Healthy"
                        : "Critical"}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Total Space</span>
                      <span className="font-medium">500 GB</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Used Space</span>
                      <span className="font-medium">320 GB (64%)</span>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            systemHealth.storage === "healthy"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: "64%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Maintenance
