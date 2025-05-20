import useAdminDashboardStats from "@/context/useAdminDashbaordStats"
import { motion } from "framer-motion"
import { DollarSign, Clock, Users, AlertTriangle, Calendar } from "lucide-react"

export default function Widgets() {
  const { data, isLoading } = useAdminDashboardStats()

  const stats = [
    {
      title: "Total Tax Collected",
      value: isLoading
        ? "Loading..."
        : new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "ETB",
          }).format(data?.totalPaidAmount),
      percentage: "+12% from last month",
      icon: <DollarSign size={24} className="text-green-600" />,
      gradient: "from-green-100 to-green-50",
      border: "border-l-4 border-green-500",
    },
    {
      title: "Pending Tax Filings",
      value: isLoading ? "Loading..." : data?.pendingTaxFilings,
      percentage: "5% decrease",
      icon: <Clock size={24} className="text-yellow-600" />,
      gradient: "from-amber-100 to-amber-50",
      border: "border-l-4 border-amber-500",
    },
    {
      title: "Active Taxpayers",
      value: isLoading ? "Loading..." : data?.totalTaxpayers,
      percentage: "+8% growth",
      icon: <Users size={24} className="text-blue-600" />,
      gradient: "from-blue-100 to-blue-50",
      border: "border-l-4 border-blue-500",
    },
    {
      title: "Late Payment Alerts",
      value: isLoading ? "Loading..." : data?.latePaymentAlerts,
      percentage: "Up 2%",
      icon: <AlertTriangle size={24} className="text-red-600" />,
      gradient: "from-red-100 to-red-50",
      border: "border-l-4 border-red-500",
    },
    {
      title: "Next Important Due Date",
      value: isLoading
        ? "Loading..."
        : new Date(data?.nextDueDate).toDateString(),
      percentage: "Quarterly Tax",
      icon: <Calendar size={24} className="text-purple-600" />,
      gradient: "from-purple-100 to-purple-50",
      border: "border-l-4 border-purple-500",
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* First Row (3 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.slice(0, 3).map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
            className={`rounded-xl p-6 bg-gradient-to-br ${stat.gradient} ${stat.border} shadow-sm hover:shadow-md transition-all duration-300 cursor-default relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full opacity-10 bg-white"></div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">
                  {stat.title}
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </span>
                <span
                  className={`text-xs mt-2 ${
                    stat.percentage.includes("+")
                      ? "text-green-600"
                      : stat.percentage.includes("Up")
                      ? "text-red-600"
                      : stat.percentage.includes("decrease")
                      ? "text-yellow-600"
                      : "text-gray-500"
                  }`}
                >
                  {stat.percentage}
                </span>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Second Row (2 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {stats.slice(3).map((stat, index) => (
          <motion.div
            key={index + 3}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: (index + 3) * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            }}
            className={`rounded-xl p-6 bg-gradient-to-br ${stat.gradient} ${stat.border} shadow-sm hover:shadow-md transition-all duration-300 cursor-default relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-16 h-16 -mr-4 -mt-4 rounded-full opacity-10 bg-white"></div>
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">
                  {stat.title}
                </span>
                <span className="text-2xl font-bold text-gray-800">
                  {stat.value}
                </span>
                <span
                  className={`text-xs mt-2 ${
                    stat.percentage.includes("+")
                      ? "text-green-600"
                      : stat.percentage.includes("Up")
                      ? "text-red-600"
                      : stat.percentage.includes("decrease")
                      ? "text-yellow-600"
                      : "text-gray-500"
                  }`}
                >
                  {stat.percentage}
                </span>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
