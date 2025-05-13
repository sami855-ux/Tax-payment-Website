import Table from "@/ui/Table"
import Row from "@/ui/Row"
import Spinner from "@/ui/Spinner"
import useUserPayments from "@/context/useUserPayment"
import { FiFilter, FiSearch, FiX } from "react-icons/fi"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

function HistoryTable({ path = "" }) {
  const { data: dataPayment, isLoading } = useUserPayments()
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    taxCategory: "",
    paymentType: "",
    dateRange: "",
    minAmount: "",
    maxAmount: "",
  })
  const [filteredData, setFilteredData] = useState([])

  // Apply filters and search whenever data or filters change
  useEffect(() => {
    if (dataPayment) {
      let result = [...dataPayment]

      // Apply search
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        result = result.filter(
          (item) =>
            item.taxCategory?.toLowerCase()?.includes(term) ||
            item.paymentId?.toLowerCase()?.includes(term) ||
            item.taxPeriod?.toLowerCase()?.includes(term)
        )
      }

      // Apply filters
      if (filters.taxCategory) {
        result = result.filter(
          (item) => item.taxCategory === filters.taxCategory
        )
      }
      if (filters.paymentType) {
        result = result.filter(
          (item) => item.paymentType === filters.paymentType
        )
      }
      if (filters.minAmount) {
        result = result.filter(
          (item) => parseFloat(item.amountPaid) >= parseFloat(filters.minAmount)
        )
      }
      if (filters.maxAmount) {
        result = result.filter(
          (item) => parseFloat(item.amountPaid) <= parseFloat(filters.maxAmount)
        )
      }
      if (filters.dateRange) {
        const [start, end] = filters.dateRange.split(" to ")
        result = result.filter((item) => {
          const itemDate = new Date(item.date)
          return (
            (!start || itemDate >= new Date(start)) &&
            (!end || itemDate <= new Date(end))
          )
        })
      }

      setFilteredData(result)
    }
  }, [dataPayment, searchTerm, filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      taxCategory: "",
      paymentType: "",
      dateRange: "",
      minAmount: "",
      maxAmount: "",
    })
    setSearchTerm("")
  }

  // Get unique values for filter dropdowns
  const taxCategories = [
    ...new Set(dataPayment?.map((item) => item.taxCategory)),
  ]
  const paymentTypes = [
    ...new Set(dataPayment?.map((item) => item.paymentType)),
  ]

  return (
    <div className="bg-white min-h-screen p-6">
      {path === "not" ? null : (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">
            Payment History
          </h2>
          <p className="text-gray-500 mt-1">View your tax payment history</p>
        </motion.div>
      )}

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`${
          path === "not" ? "border-gray-200" : "mt-7 border-gray-200"
        } w-full overflow-x-scroll bg-white h-fit rounded-xl border "`}
      >
        <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search filings..."
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiFilter className="mr-2" />
              Filters{" "}
              {Object.values(filters).some((f) => f) &&
                `(${Object.values(filters).filter((f) => f).length})`}
            </button>

            {(searchTerm || Object.values(filters).some((f) => f)) && (
              <button
                onClick={resetFilters}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                <FiX className="mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-3 border-b border-gray-200 bg-gray-50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Category
                </label>
                <select
                  name="taxCategory"
                  value={filters.taxCategory}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Categories</option>
                  {taxCategories?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select
                  name="paymentType"
                  value={filters.paymentType}
                  onChange={handleFilterChange}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Types</option>
                  {paymentTypes?.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <input
                  type="text"
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  placeholder="YYYY-MM-DD to YYYY-MM-DD"
                  className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Amount
                </label>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="Minimum amount"
                  className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Amount
                </label>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="Maximum amount"
                  className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                />
              </div>
            </div>
          </motion.div>
        )}

        <>
          <Table columns="1fr 2fr 1fr 1fr 1fr 0.5fr">
            <Table.Header>
              <div>Tax Category</div>
              <div>Payment ID</div>
              <div>Tax period</div>
              <div>Date</div>
              <div>Amount paid</div>
              <div>Payment Type</div>
            </Table.Header>

            {isLoading ? (
              <Spinner />
            ) : (
              <Table.Body
                data={filteredData.length > 0 ? filteredData : dataPayment}
                render={(data, dataIndex) => (
                  <Row rowData={data} key={dataIndex} />
                )}
              />
            )}
          </Table>
        </>
      </motion.div>
    </div>
  )
}

export default HistoryTable
