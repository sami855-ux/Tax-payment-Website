// AdminDashboardUI.jsx
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { HeatmapGrid } from "react-heatmap-grid"
import { format, parseISO } from "date-fns"
import {
  BarChart4,
  CalendarDays,
  Clock4,
  Users,
  Download,
  FileText,
  // PieChart,
} from "lucide-react"
import useAdminDashboardStats from "@/context/useAdminDashbaordStats"
import Spinner from "@/ui/Spinner"
import { useQuery } from "@tanstack/react-query"
import { getMonthlyTrends } from "@/services/Tax"
import {
  PieChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  Cell,
} from "recharts"

export default function AdminDashboardUI() {
  const [selectedFilter, setSelectedFilter] = useState("This Month")
  const { data, isLoading } = useAdminDashboardStats()
  const { data: report, isLoading: reportLoading } = useQuery({
    queryKey: ["report"],
    queryFn: getMonthlyTrends,
  })

  const filingData = {
    category: "personal",
    total: 10,
    statuses: [
      { status: "approved", count: 5 },
      { status: "submitted", count: 3 },
      { status: "pending", count: 2 },
    ],
  }

  // Transform the data for the chart
  const chartData = filingData.statuses.map((item) => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
    value: item.count,
    color:
      item.status === "approved"
        ? "#10B981"
        : item.status === "submitted"
        ? "#3B82F6"
        : "#F59E0B",
  }))

  useEffect(() => {
    document.title = "Report and analytics "
  }, [])

  const Card = ({ title, value, icon }) => (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="text-blue-600 text-3xl">{icon}</div>
      </div>
    </motion.div>
  )

  if (isLoading || reportLoading) return <Spinner />

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 pt-5"
      >
        <h1 className="text-4xl font-bold mb-2 text-gray-800">
          Tax report and analytics
        </h1>
        <p className="text-gray-500">
          Manage platform settings, profile, and preferences
        </p>
      </motion.div>

      {/* Revenue Summary */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Revenue Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Total Collected"
            value={new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "ETB",
            }).format(data?.totalPaidAmount)}
            icon={<BarChart4 />}
          />
          <Card
            title="Pending Payments"
            value={data?.pendingTaxFilings}
            icon={<Clock4 />}
          />
          <Card
            title="Active Users"
            value={data?.totalTaxpayers}
            icon={<Users />}
          />
        </div>
        <div className="mt-6 p-6 rounded-2xl bg-white shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Monthly Collection Trend
          </h3>
          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { month: "1/2025", totalCollected: 12000 },
                  { month: "2/2025", totalCollected: 18500 },
                  { month: "3/2025", totalCollected: 16200 },
                  { month: "4/2025", totalCollected: 20150 },
                  { month: "5/2025", totalCollected: 17400 },
                ]}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#6b7280" }}
                  tickMargin={10}
                />
                <YAxis
                  tick={{ fill: "#6b7280" }}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString()}`,
                    "Total Collected",
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalCollected"
                  name="Total Collected"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, stroke: "#1d4ed8", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* User Compliance */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          User Compliance
        </h2>
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <div className="flex justify-between mb-4">
            <div>
              <label className="text-sm text-gray-600 mr-2">Filter:</label>
              <select
                className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option>This Month</option>
                <option>Last Quarter</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <table className="w-full text-sm text-left text-gray-600">
            <thead>
              <tr className="border-b">
                <th className="py-2">Taxpayer</th>
                <th>Status</th>
                <th>Filed On Time</th>
                <th>Avg Delay (days)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2">Corporation A</td>
                <td>Active</td>
                <td>92%</td>
                <td>1.3</td>
              </tr>
              <tr>
                <td className="py-2">Sole Trader B</td>
                <td>Inactive</td>
                <td>68%</td>
                <td>4.2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tax Filing Summary */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Tax Filing Summary
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
            <h3 className="mb-4 font-medium text-gray-700">
              Filing Distribution ({filingData.category})
            </h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      value,
                      `${name}: ${((props.payload.percent || 0) * 100).toFixed(
                        1
                      )}%`,
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: "20px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Export Tools */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Export & Sharing
        </h2>
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 space-y-4">
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2">
              <Download size={18} /> Export as PDF
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 flex items-center gap-2">
              <FileText size={18} /> Export as CSV
            </button>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">
              Scheduled Reports
            </h4>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>Weekly Revenue Report - every Monday</li>
              <li>Compliance Summary - 1st of every month</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
