import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/helpers/util"

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
          {activeSection === "profile" && (
            <SectionWrapper title="Update Profile">
              <Input label="Full Name" placeholder="John Doe" />
              <Input label="Email" placeholder="john@example.com" />
              <Input label="Age" placeholder="22" />
              <Input label="Kebele" placeholder="02" />
              <Input label="Wereda" placeholder="Mehal Meda" />
              <SaveButton />
            </SectionWrapper>
          )}

          {activeSection === "security" && (
            <SectionWrapper title="Security Settings">
              <Input label="New Password" type="password" />
              <Input label="Confirm Password" type="password" />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded cursor-pointer text-indigo-600 outline-none focus:ring-2"
                />
                <label className="text-gray-700 text-sm">
                  Enable Two-Factor Authentication (2FA)
                </label>
              </div>
              <SaveButton />
            </SectionWrapper>
          )}

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
              <button className="w-full px-6 py-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition mb-4 cursor-pointer">
                Export My Data
              </button>
              <button className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-400 transition cursor-pointer">
                Delete My Account
              </button>
            </SectionWrapper>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// Reusable Components
function SectionWrapper({ children, title }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h3 className="text-3xl font-bold text-gray-800 mb-6">{title}</h3>
      <div className="space-y-4">{children}</div>
    </motion.div>
  )
}

function Input({ label, type = "text", placeholder }) {
  return (
    <div>
      <label className="block mb-3 text-sm text-gray-700 font-semibold">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-[90%] p-3 border rounded-lg border-gray-300  focus:border-gray-500 outline-none"
      />
    </div>
  )
}

function Toggle({ label }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 border border-gray-300 rounded-lg shadow-sm">
      <span className="text-gray-800">{label}</span>
      <input
        type="checkbox"
        className="w-6 h-6 rounded-full text-indigo-600  focus:ring-2 cursor-pointer"
      />
    </div>
  )
}

function SaveButton() {
  return (
    <button className="mt-6 px-12 cursor-pointer py-2 text-[16px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
      Save Changes
    </button>
  )
}
