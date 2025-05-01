// components/AdminSettings.jsx
import { motion } from "framer-motion"
import { useEffect } from "react"

export default function AdminSettings() {
  useEffect(() => {
    document.title = "Admin settings "
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        🛠️ Admin Configuration Panel
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Tax Rule Configuration */}
        <motion.div
          className="bg-white/80 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">
            Tax Rule Configuration
          </h2>
          <div className="space-y-5">
            <Field label="Fiscal Year" placeholder="2024/2025" />
            <Field label="Income Tax Bracket (%)" placeholder="0 - 30" />
            <Toggle label="Enable VAT" />
            <Field label="Penalty Rate (%)" type="number" placeholder="10" />
          </div>
        </motion.div>

        {/* System Settings */}
        <motion.div
          className="bg-white/80 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-blue-900 mb-6">
            System Settings
          </h2>
          <div className="space-y-5">
            <Toggle label="Maintenance Mode" />
            <Select label="Currency" options={["ETB", "USD"]} />
            <Select label="Locale" options={["English", "Amharic"]} />
            <Toggle label="2FA Login Security" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Shared Input Components

const Field = ({ label, placeholder, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>
)

const Toggle = ({ label }) => (
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input type="checkbox" className="w-5 h-5 accent-blue-600 cursor-pointer" />
  </div>
)

const Select = ({ label, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <select className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
      {options.map((opt, i) => (
        <option key={i} value={opt.toLowerCase()}>
          {opt}
        </option>
      ))}
    </select>
  </div>
)
