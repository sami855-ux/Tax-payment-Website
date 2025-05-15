import { motion, AnimatePresence } from "framer-motion"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import {
  FiDollarSign,
  FiCalendar,
  FiAlertCircle,
  FiUsers,
  FiSlash,
  FiDownload,
  FiMail,
  FiClock,
} from "react-icons/fi"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import toast, { Toaster } from "react-hot-toast"
import { Spinner } from "@radix-ui/themes"
import OfficialDashboardData from "@/context/OfficialDashboardData"

const COLORS = {
  green: {
    100: "#d1fae5",
    300: "#6ee7b7",
    500: "#10b981",
    700: "#047857",
  },
  teal: {
    500: "#14b8a6",
  },
  emerald: {
    500: "#10b981",
  },
}

const OfficialReport = () => {
  const { data, isLoading } = OfficialDashboardData()

  const complianceData = [
    { name: "On Time", value: 78 },
    { name: "Late", value: 15 },
    { name: "Missed", value: 7 },
  ]

  const handleExport = (type) => {
    switch (type) {
      case "PDF":
        exportAsPDF()
        break
      case "CSV":
        exportAsCSV()
        break
      case "Email":
        // emailReport()
        break
      default:
        console.warn("Unsupported export type:", type)
    }
  }
  const exportAsPDF = () => {
    console.log("pdf")
    const doc = new jsPDF()
    doc.text("Tax Dashboard Report", 14, 20)

    // Dummy data – replace with your actual report
    const tableColumn = ["Name", "Total Paid", "Status"]
    const tableRows = data.paymentData

    autoTable(doc, {
      startY: 30,
      head: tableColumn,
      body: tableRows,
    })

    doc.save("report.pdf")
  }

  const exportAsCSV = () => {
    const headers = ["Name", "Total Paid", "Status"]
    const rows = data.paymentData

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "report.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-800 mb-8"
      >
        Report and Analytics
      </motion.h1>

      {/* Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          {
            icon: <FiDollarSign />,
            title: "Total Tax Collected",
            value: data.totalTaxCollected,
            color: "emerald",
          },
          {
            icon: <FiCalendar />,
            title: "Upcoming Payments",
            value: data.upcomingPayments,
            color: "teal",
          },
          {
            icon: <FiAlertCircle />,
            title: "Overdue Payments",
            value: data.overduePayments,
            color: "amber",
          },
          {
            icon: <FiUsers />,
            title: "Assigned active Taxpayers",
            value: data.activeTaxpayers,
            color: "blue",
          },
        ].map((widget, index) => (
          <motion.div
            key={widget.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {widget.title}
                </p>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {widget.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-full bg-${widget.color}-100 text-${widget.color}-600`}
              >
                {widget.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Payment Trends */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Payment Trends
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.paymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={COLORS.emerald[500]}
                  strokeWidth={2}
                  dot={{ fill: COLORS.emerald[700], strokeWidth: 2, r: 4 }}
                  activeDot={{
                    fill: COLORS.emerald[700],
                    strokeWidth: 2,
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Tax Distribution */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Tax Distribution
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.taxDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data?.taxDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          COLORS.green[500],
                          COLORS.teal[500],
                          COLORS.emerald[500],
                          COLORS.green[300],
                        ][index % 4]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Top Taxpayers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Top Taxpayers
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topTaxpayers && data.topTaxpayers > 0 ? (
                  data.topTaxpayers.map((taxpayer, index) => (
                    <motion.tr
                      key={taxpayer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {taxpayer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {taxpayer.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${taxpayer.totalPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            taxpayer.status === "Compliant"
                              ? "bg-green-100 text-green-800"
                              : taxpayer.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {taxpayer.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <p className="text-[14px] text-center py-4">
                    There is no taxpayers that hs paid until now
                  </p>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Compliance Breakdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Compliance Breakdown
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="value" name="Percentage">
                  {complianceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        [
                          COLORS?.green[500],
                          COLORS?.teal[500],
                          COLORS?.emerald[500],
                        ][index % 3]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Export Reports
        </h2>
        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport("PDF")}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <FiDownload className="mr-2" />
            Download PDF
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport("CSV")}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FiDownload className="mr-2" />
            Export CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExport("Email")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiMail className="mr-2" />
            Email Report
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default OfficialReport
