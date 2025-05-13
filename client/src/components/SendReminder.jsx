import { createNotificationAPI, increaseNotice } from "@/services/notification"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import {
  FiSend,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiBell,
} from "react-icons/fi"

const SendReminder = ({ onCloseModal, data }) => {
  const [formData, setFormData] = useState({
    recipient: "",
    recipientType: "taxpayer",
    notificationType: "reminder",
    message: "",
    link: "",
  })
  const queryClient = useQueryClient()
  const [isSending, setIsSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSend = async () => {
    const data = {
      recipient: formData.recipient,
      recipientModel: formData.recipientType,
      type: formData.notificationType,
      message: formData.message,
      link: formData.link,
    }
    setIsSending(true)
    try {
      const res = await createNotificationAPI(data)

      if (res.success) {
        toast.success(res.message)
        setSuccess(true)

        const res2 = await increaseNotice(data.recipient)
        console.log(res2)
        queryClient.invalidateQueries(["assigned-taxpayers"])
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      console.error("Error sending reminder:", error)
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    formData.recipient = data._id
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden w-[500px]">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center">
          <FiSend className="mr-2" /> Send Reminder
        </h2>
      </div>

      <div className="p-6">
        {success ? (
          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <FiCheckCircle className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              Reminder Sent!
            </h3>
            <p className="text-gray-600">
              Your notification has been delivered.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient
                </label>
                <input
                  type="text"
                  value={data.fullName}
                  disabled={true}
                  className="w-full px-3 disabled:bg-gray-200 disabled:cursor-not-allowed py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Type
                </label>
                <input
                  type="text"
                  value={"Taxpayer"}
                  disabled={true}
                  className="w-full px-3 disabled:bg-gray-200 disabled:cursor-not-allowed py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Type
                </label>
                <select
                  value={formData.notificationType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notificationType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="reminder">Reminder</option>
                  <option value="warning">Warning</option>
                  <option value="info">Information</option>
                  <option value="success">Success</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your message here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link (optional)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., /dashboard/filings/123"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={onCloseModal}
                disabled={isSending}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSending || !formData.recipient || !formData.message}
                className={`px-10 cursor-pointer py-2 rounded-md text-white flex items-center ${
                  isSending || !formData.recipient || !formData.message
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSending ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-1" /> Send
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SendReminder
