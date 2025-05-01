import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/helpers/util"
import SectionWrapper from "@/ui/SectionWrapper"
import Input from "@/ui/Input"
import Toggle from "@/ui/Toggle"
import SaveButton from "@/ui/SaveButton"
import UpdateProfile from "./UpdateProfile"
import SecuritySetting from "./SecuritySetting"
import { deleteUser, exportUserToPDF, logoutUser } from "@/services/apiUser"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const sections = [
  { id: "profile", label: "Profile" },
  { id: "security", label: "Security" },
  { id: "payments", label: "Payments" },
  { id: "tax", label: "Tax Preferences" },
  { id: "notifications", label: "Notifications" },
  { id: "account", label: "Account" },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile")
  const navigate = useNavigate()

  const handleExportData = async () => {
    try {
      await exportUserToPDF()

      toast.success("User data is being exported to PDF.")
    } catch (error) {
      console.error("Error exporting user data:", error)
      toast.error("Failed to export user data. Please try again.")
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const res = await deleteUser()
      if (res.success) {
        toast.success(res.message)

        //redirect the user or perform any other action after deletion
        navigate("/")
      }
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error("Failed to delete account. Please try again.")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 shadow-lg rounded-tr-3xl rounded-br-3xl">
        <h2 className="text-2xl font-bold text-indigo-600 mb-8">Settings</h2>
        <nav className="space-y-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 font-medium transition cursor-pointer",
                activeSection === section.id && "bg-indigo-500 text-white"
              )}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeSection === "profile" && <UpdateProfile />}

          {activeSection === "security" && <SecuritySetting />}

          {activeSection === "payments" && (
            <SectionWrapper title="Manage Payment Methods">
              <div className="bg-white p-4 border rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-semibold text-gray-700">Bank Account</h4>
                  <p className="text-gray-400 text-sm">xxxx-xxxx-4321</p>
                </div>
                <button className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              </div>
              <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                + Add Payment Method
              </button>
            </SectionWrapper>
          )}

          {activeSection === "tax" && (
            <SectionWrapper title="Tax Setup">
              <select className="w-full p-3 border border-gray-400 outline-none rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 mb-4">
                <option>Income Tax</option>
                <option>Corporate Tax</option>
                <option>VAT</option>
                <option>Property Tax</option>
              </select>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer text-indigo-600 rounded focus:ring-2"
                />
                <label className="text-gray-700 text-sm">
                  Enable Tax Filing Reminders
                </label>
              </div>
              <SaveButton />
            </SectionWrapper>
          )}

          {activeSection === "notifications" && (
            <SectionWrapper title="Notifications">
              <Toggle label="Payment Updates" />
              <Toggle label="System Alerts" />
              <Toggle label="New Messages" />
              <SaveButton />
            </SectionWrapper>
          )}

          {activeSection === "account" && (
            <SectionWrapper title="Account Settings">
              <button
                className="w-full px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition mb-4 cursor-pointer"
                onClick={handleExportData}
              >
                Export My Data
              </button>
              <button
                className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-400 transition cursor-pointer"
                onClick={handleDeleteAccount}
              >
                Delete My Account
              </button>
            </SectionWrapper>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
