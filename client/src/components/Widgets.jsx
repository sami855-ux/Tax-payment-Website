//eslint-disable-next-line
import { motion } from "framer-motion"
import { DollarSign, Clock, Users, AlertTriangle, Calendar } from "lucide-react"

const stats = [
  {
    title: "Total Tax Collected",
    value: "$1,400,000",
    percentage: "+12% from last month",
    icon: <DollarSign size={32} className="text-green-600" />,
    gradient: "from-red-300 via-red-200 to-red-400",
  },
  {
    title: "Pending Tax Filings",
    value: "23",
    percentage: "5% decrease",
    icon: <Clock size={32} className="text-yellow-500" />,
    gradient: "from-red-300 via-red-200 to-red-400",
  },
  {
    title: "Active Taxpayers",
    value: "12,500",
    percentage: "+8% growth",
    icon: <Users size={32} className="text-blue-600" />,
    gradient: "from-red-300 via-red-200 to-red-400",
  },
  {
    title: "Late Payment Alerts",
    value: "18",
    percentage: "Up 2%",
    icon: <AlertTriangle size={32} className="text-red-600" />,
    gradient: "from-red-300 via-red-200 to-red-400",
  },
  {
    title: "Next Important Due Date",
    value: "June 15, 2025",
    percentage: "Quarterly Tax",
    icon: <Calendar size={32} className="text-purple-600" />,
    gradient: "from-red-300 via-red-200 to-red-400",
  },
]

export default function Widgets() {
  return (
    <div className="flex flex-col gap-5">
      {/* First Row (3 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.slice(0, 3).map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`rounded-lg p-6 bg-gradient-to-br bg-red-100 cursor-default`}
          >
            <div className="flex items-center gap-5">
              <div className="bg-white rounded-full p-3 shadow-md">
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                  {stat.title}
                </span>
                <span className="text-3xl font-extrabold text-gray-800 mt-1">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {stat.percentage}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Second Row (2 cards centered) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 justify-center">
        {stats.slice(3).map((stat, index) => (
          <motion.div
            key={index + 3}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: (index + 3) * 0.2 }}
            className={`rounded-lg p-6 bg-gradient-to-br bg-red-100  cursor-default`}
          >
            <div className="flex items-center gap-5">
              <div className="bg-white rounded-full p-3 shadow-md">
                {stat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 font-medium text-sm uppercase tracking-wide">
                  {stat.title}
                </span>
                <span className="text-2xl font-extrabold text-gray-800 mt-1">
                  {stat.value}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  {stat.percentage}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
