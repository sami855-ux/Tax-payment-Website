import { FiFilter, FiSearch } from "react-icons/fi"
import { motion } from "framer-motion"

import HistoryTable from "./HistoryTable"

export default function PaymentHistory() {
  return (
    <div className="bg-white min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
          Payment History
        </h2>
        <p className="text-gray-500 mt-1">View your tax payment history</p>
      </motion.div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-full overflow-x-scroll bg-white h-fit mt-7 rounded-xl border border-gray-200"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="relative w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search filings..."
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <FiFilter className="mr-2" />
            Filters
          </button>
        </div>
        <HistoryTable />
      </motion.div>
    </div>
  )
}
