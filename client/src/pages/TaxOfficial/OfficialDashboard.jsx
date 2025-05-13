import { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  FiDollarSign,
  FiFileText,
  FiAlertCircle,
  FiClock,
  FiUsers,
  FiBell,
} from "react-icons/fi"
import { motion } from "framer-motion"
import { HiCheck } from "react-icons/hi"
import {
  AlertCircle,
  AlertTriangle,
  BellRing,
  CheckCircle2,
  CircleDollarSign,
  Download,
  Map,
} from "lucide-react"
import { useDispatch } from "react-redux"
import { login } from "@/redux/slice/userSlice"
import { getUserById } from "@/services/apiUser"
import { fetchNotifications } from "@/redux/slice/notificationSlice"

// Sample data
const timelineData = [
  { name: "Jan", filings: 120, payments: 100, lastYear: 80 },
  { name: "Feb", filings: 210, payments: 190, lastYear: 120 },
  { name: "Mar", filings: 180, payments: 160, lastYear: 140 },
  { name: "Apr", filings: 280, payments: 250, lastYear: 180 },
  { name: "May", filings: 200, payments: 180, lastYear: 150 },
]

const complianceData = [
  { name: "On Time", value: 65 },
  { name: "Late", value: 15 },
  { name: "Not Filed", value: 10 },
  { name: "Exempt", value: 10 },
]

const activityData = [
  { type: "filed", name: "John Doe", amount: null },
  { type: "missed", name: "Mesfin Ltd", amount: null },
  { type: "paid", name: "Kora Corp", amount: 12500 },
  { type: "filed", name: "Addis Trading", amount: null },
  { type: "paid", name: "Blue Nile Inc", amount: 8700 },
]

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#00C49F"]

const Card = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center border border-green-100 hover:shadow-md transition-shadow">
    <div className="p-3 rounded-full bg-green-200 text-green-600 mr-4">
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  </div>
)

const ActivityItem = ({ type, name, amount }) => {
  const icons = {
    filed: <CheckCircle2 className="text-green-500" size={20} />,
    missed: <AlertCircle className="text-yellow-500" size={20} />,
    paid: <CircleDollarSign className="text-blue-500" size={20} />,
  }

  const descriptions = {
    filed: "filed tax return",
    missed: "missed payment deadline",
    paid: "ETB received from",
  }

  return (
    <div className="py-2 border-b border-gray-200 last:border-0 flex gap-2 items-center">
      <span className="mr-2">{icons[type]}</span>
      <span className="font-medium w-32">{name}</span> {descriptions[type]}{" "}
      {amount && (
        <span className="font-semibold">{amount.toLocaleString()}</span>
      )}
    </div>
  )
}

const QuickActionButton = ({ icon, label }) => (
  <motion.button
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
    className="flex flex-col items-center justify-center p-4 cursor-pointer bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 transition-colors"
  >
    <div className="text-2xl mb-2 bg-gray-200 p-2 rounded-full">{icon}</div>
    <div className="text-sm text-center">{label}</div>
  </motion.button>
)

export default function OfficialDashboard() {
  const [activeIndex, setActiveIndex] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    document.title = "Admin dashboard"

    const getUserInfo = async () => {
      const res = await getUserById()

      if (res.success) {
        dispatch(
          login({
            user: res.user,
          })
        )
      }
    }
    dispatch(fetchNotifications())

    getUserInfo()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className=""
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-7">Dashboard</h1>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-6"
      >
        <Card
          title="Total Tax Collected"
          value="ETB 1,240,000"
          icon={<FiDollarSign size={30} />}
        />
        <Card
          title="Returns Filed This Month"
          value="280"
          icon={<FiFileText size={30} />}
        />
        <Card
          title="Overdue Filings"
          value="42"
          icon={<FiAlertCircle size={30} />}
        />
        <Card
          title="Outstanding Payments"
          value="ETB 380,500"
          icon={<FiClock size={30} />}
        />
        <Card
          title="Active Taxpayers"
          value="1,842"
          icon={<FiUsers size={30} />}
        />
        <Card title="Notices Sent" value="36" icon={<FiBell size={30} />} />
      </motion.div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
      >
        {/* Timeline Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg text-gray-800 font-bold mb-4">
            Filings & Payment Timeline
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="filings"
                  name="Filings This Year"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="payments"
                  name="Payments This Year"
                  stroke="#10b981"
                  fill="#6ee7b7"
                  fillOpacity={0.5}
                />
                <Area
                  type="monotone"
                  dataKey="lastYear"
                  name="Filings Last Year"
                  stroke="#d1d5db"
                  fill="#e5e7eb"
                  fillOpacity={0.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Compliance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 ">
          <h2 className="text-lg text-gray-800 font-bold mb-4">
            Compliance Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {complianceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {complianceData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg text-gray-800 font-bold mb-4">
            Recent Activity
          </h2>
          <div className="space-y-2">
            {activityData.map((item, index) => (
              <ActivityItem
                key={index}
                type={item.type}
                name={item.name}
                amount={item.amount}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionButton
              icon={<Download className="text-blue-500" size={30} />}
              label="View Latest Filings"
            />
            <QuickActionButton
              icon={<AlertTriangle className="text-amber-500" size={30} />}
              label="Review Overdue"
            />
            <QuickActionButton
              icon={<BellRing className="text-purple-500" size={30} />}
              label="Send Reminders"
            />
            <QuickActionButton
              icon={<Map className="text-green-500" size={30} />}
              label="Area Performance"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
