import { useState, useEffect, useMemo } from "react"
import { useTable, useFilters, usePagination, useSortBy } from "react-table"
import { motion, AnimatePresence } from "framer-motion"
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  subMonths,
  isWithinInterval,
  addDays,
} from "date-fns"
import {
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiDownload,
  FiFileText,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiArrowLeft,
  FiArrowRight,
  FiFlag,
} from "react-icons/fi"

const PaymentLog = () => {
  // Sample data - in a real app this would come from an API
  const sampleData = useMemo(
    () => [
      {
        id: "TXN-84571254",
        taxpayerName: "ተሾመ �/ጊዮርጊስ",
        email: "teshome@example.com",
        taxCategory: "VAT",
        amount: 4320,
        date: "2025-04-29T12:35:00",
        paymentMethod: "Mobile Money",
        status: "Success",
        referenceNo: "R123456",
        description: "Paid for Q1 VAT",
        receiptUrl: "/receipts/txn-84571254.pdf",
        disputed: false,
      },
      {
        id: "TXN-84571255",
        taxpayerName: "ሰማይ አበበ",
        email: "samay@example.com",
        taxCategory: "Income Tax",
        amount: 12500,
        date: "2025-04-28T09:15:00",
        paymentMethod: "Bank Transfer",
        status: "Success",
        referenceNo: "R123457",
        description: "Annual income tax payment",
        receiptUrl: "/receipts/txn-84571255.pdf",
        disputed: false,
      },
      {
        id: "TXN-84571256",
        taxpayerName: "ሀዋሳ ተክለሃይማኖት",
        email: "hawassa@example.com",
        taxCategory: "Property Tax",
        amount: 8700,
        date: "2025-04-27T14:22:00",
        paymentMethod: "Card",
        status: "Pending",
        referenceNo: "R123458",
        description: "Commercial property tax Q2",
        receiptUrl: null,
        disputed: false,
      },
      {
        id: "TXN-84571257",
        taxpayerName: "ዘሪቱ ከበደ",
        email: "zeritu@example.com",
        taxCategory: "VAT",
        amount: 3200,
        date: "2025-04-25T16:45:00",
        paymentMethod: "Mobile Money",
        status: "Failed",
        referenceNo: "R123459",
        description: "VAT payment attempt",
        receiptUrl: null,
        disputed: true,
      },
      {
        id: "TXN-84571258",
        taxpayerName: "ተሾመ ወ/ጊዮርጊስ",
        email: "teshome@example.com",
        taxCategory: "Income Tax",
        amount: 7500,
        date: "2025-04-20T11:30:00",
        paymentMethod: "Bank Transfer",
        status: "Success",
        referenceNo: "R123460",
        description: "Additional income tax payment",
        receiptUrl: "/receipts/txn-84571258.pdf",
        disputed: false,
      },
    ],
    []
  )

  // State management
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filters, setFilters] = useState({
    taxpayer: "",
    category: "",
    status: "",
    disputed: "",
    startDate: subMonths(new Date(), 1),
    endDate: new Date(),
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Fetch data - in a real app this would be an API call
  useEffect(() => {
    setLoading(true)
    // Simulate API call with delay
    const timer = setTimeout(() => {
      setData(sampleData)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [sampleData])

  // Filter data based on filter criteria
  const filteredData = useMemo(() => {
    return data.filter((payment) => {
      // Date filter
      const paymentDate = parseISO(payment.date)
      const withinDateRange = isWithinInterval(paymentDate, {
        start: filters.startDate,
        end: filters.endDate,
      })

      if (!withinDateRange) return false

      // Taxpayer name filter
      if (
        filters.taxpayer &&
        !payment.taxpayerName
          .toLowerCase()
          .includes(filters.taxpayer.toLowerCase())
      ) {
        return false
      }

      // Category filter
      if (filters.category && payment.taxCategory !== filters.category) {
        return false
      }

      // Status filter
      if (filters.status && payment.status !== filters.status) {
        return false
      }

      // Disputed filter
      if (
        filters.disputed !== "" &&
        payment.disputed !== (filters.disputed === "true")
      ) {
        return false
      }

      return true
    })
  }, [data, filters])

  // Define columns for react-table
  const columns = useMemo(
    () => [
      {
        Header: "Taxpayer Name",
        accessor: "taxpayerName",
        Cell: ({ value }) => <span className="font-medium">{value}</span>,
        Filter: ({ column }) => (
          <input
            type="text"
            placeholder="Search by name..."
            value={filters.taxpayer}
            onChange={(e) =>
              setFilters({ ...filters, taxpayer: e.target.value })
            }
            className="text-sm border rounded p-1 w-full"
          />
        ),
      },
      {
        Header: "Tax Category",
        accessor: "taxCategory",
        Filter: ({ column }) => (
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="text-sm border rounded p-1 w-full"
          >
            <option value="">All Categories</option>
            <option value="Income Tax">Income Tax</option>
            <option value="VAT">VAT</option>
            <option value="Property Tax">Property Tax</option>
          </select>
        ),
      },
      {
        Header: "Amount Paid",
        accessor: "amount",
        Cell: ({ value }) => <span>{value.toLocaleString()} ETB</span>,
        sortType: "basic",
      },
      {
        Header: "Date & Time",
        accessor: "date",
        Cell: ({ value }) => format(parseISO(value), "MMM dd, yyyy hh:mm a"),
        sortType: "datetime",
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: ({ value }) => {
          const icons = {
            Card: <FiCreditCard className="inline mr-1" />,
            "Bank Transfer": <FiDollarSign className="inline mr-1" />,
            "Mobile Money": <FiUser className="inline mr-1" />,
          }
          return (
            <span>
              {icons[value] || null}
              {value}
            </span>
          )
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value, row }) => {
          const statusClasses = {
            Success: "bg-green-100 text-green-800",
            Failed: "bg-red-100 text-red-800",
            Pending: "bg-yellow-100 text-yellow-800",
          }
          const icons = {
            Success: <FiCheckCircle className="inline mr-1" />,
            Failed: <FiXCircle className="inline mr-1" />,
            Pending: <FiClock className="inline mr-1" />,
          }

          return (
            <div className="flex items-center space-x-1">
              <span
                className={`px-2 py-1 rounded-full text-xs ${statusClasses[value]}`}
              >
                {icons[value]}
                {value}
              </span>
              {row.original.disputed && (
                <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                  <FiFlag className="inline mr-1" />
                  Disputed
                </span>
              )}
            </div>
          )
        },
        Filter: ({ column }) => (
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="text-sm border rounded p-1 w-full"
          >
            <option value="">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
        ),
      },
      {
        Header: "Disputed",
        accessor: "disputed",
        Cell: ({ value }) =>
          value ? (
            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              <FiFlag className="inline mr-1" />
              Disputed
            </span>
          ) : null,
        Filter: ({ column }) => (
          <select
            value={filters.disputed}
            onChange={(e) =>
              setFilters({ ...filters, disputed: e.target.value })
            }
            className="text-sm border rounded p-1 w-full"
          >
            <option value="">All</option>
            <option value="true">Disputed</option>
            <option value="false">Not Disputed</option>
          </select>
        ),
        disableSortBy: true,
      },
      {
        Header: "Actions",
        accessor: "id",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              setSelectedPayment(row.original)
              setShowModal(true)
            }}
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <FiExternalLink className="mr-1" />
            View
          </button>
        ),
        disableSortBy: true,
        disableFilters: true,
      },
    ],
    [filters]
  )

  // Create table instance
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [{ id: "date", desc: true }], // Default sort by date descending
      },
    },
    useFilters,
    useSortBy,
    usePagination
  )

  // Date range selection handler
  const handleDateChange = (item) => {
    setFilters({
      ...filters,
      startDate: item.selection.startDate,
      endDate: item.selection.endDate,
    })
    setShowDatePicker(false)
  }

  // Export to CSV function
  const exportToCSV = () => {
    const headers = [
      "Taxpayer Name",
      "Email",
      "Tax Category",
      "Amount (ETB)",
      "Date & Time",
      "Payment Method",
      "Status",
      "Transaction ID",
      "Reference No",
      "Description",
    ].join(",")

    const rows = filteredData.map((item) =>
      [
        `"${item.taxpayerName}"`,
        `"${item.email}"`,
        `"${item.taxCategory}"`,
        item.amount,
        `"${format(parseISO(item.date), "yyyy-MM-dd HH:mm")}"`,
        `"${item.paymentMethod}"`,
        `"${item.status}"`,
        `"${item.id}"`,
        `"${item.referenceNo}"`,
        `"${item.description}"`,
      ].join(",")
    )

    const csvContent = `${headers}\n${rows.join("\n")}`
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute(
      "download",
      `payment_logs_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Flag payment as disputed
  const flagAsDisputed = () => {
    if (!selectedPayment) return

    // In a real app, this would call your API
    setData((prevData) =>
      prevData.map((item) =>
        item.id === selectedPayment.id ? { ...item, disputed: true } : item
      )
    )

    setSelectedPayment((prev) => (prev ? { ...prev, disputed: true } : null))
    setShowModal(false)
  }

  // Quick date range presets
  const applyDatePreset = (preset) => {
    const today = new Date()
    let startDate,
      endDate = today

    switch (preset) {
      case "today":
        startDate = today
        break
      case "yesterday":
        startDate = addDays(today, -1)
        endDate = addDays(today, -1)
        break
      case "thisWeek":
        startDate = addDays(today, -today.getDay()) // Start of week (Sunday)
        break
      case "lastWeek":
        startDate = addDays(today, -today.getDay() - 7)
        endDate = addDays(startDate, 6)
        break
      case "thisMonth":
        startDate = startOfMonth(today)
        break
      case "lastMonth":
        startDate = startOfMonth(subMonths(today, 1))
        endDate = endOfMonth(startDate)
        break
      case "last30":
        startDate = addDays(today, -30)
        break
      default:
        startDate = subMonths(today, 1)
    }

    setFilters({
      ...filters,
      startDate,
      endDate,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment Logs</h1>

        {/* Filters and Export Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by taxpayer name..."
                value={filters.taxpayer}
                onChange={(e) =>
                  setFilters({ ...filters, taxpayer: e.target.value })
                }
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <FiDownload className="mr-2" />
                Export CSV
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
                onClick={() => alert("PDF export would be implemented here")}
              >
                <FiDownload className="mr-2" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700">Date Range</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => applyDatePreset("today")}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Today
                </button>
                <button
                  onClick={() => applyDatePreset("yesterday")}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Yesterday
                </button>
                <button
                  onClick={() => applyDatePreset("thisWeek")}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  This Week
                </button>
                <button
                  onClick={() => applyDatePreset("last30")}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  Last 30 Days
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div
                className="border rounded-lg p-2 cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <label className="block text-sm text-gray-500 mb-1">From</label>
                <div className="flex items-center">
                  <FiCalendar className="text-gray-400 mr-2" />
                  <span>{format(filters.startDate, "MMM dd, yyyy")}</span>
                </div>
              </div>
              <div
                className="border rounded-lg p-2 cursor-pointer"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <label className="block text-sm text-gray-500 mb-1">To</label>
                <div className="flex items-center">
                  <FiCalendar className="text-gray-400 mr-2" />
                  <span>{format(filters.endDate, "MMM dd, yyyy")}</span>
                </div>
              </div>
            </div>

            {showDatePicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 overflow-hidden"
              >
                <DateRangePicker
                  ranges={[
                    {
                      startDate: filters.startDate,
                      endDate: filters.endDate,
                      key: "selection",
                    },
                  ]}
                  onChange={handleDateChange}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  direction="horizontal"
                  className="w-full"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Payment Logs Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-50">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div className="flex items-center">
                            {column.render("Header")}
                            {column.canSort && (
                              <span className="ml-1">
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <FiChevronDown className="w-4 h-4" />
                                  ) : (
                                    <FiChevronUp className="w-4 h-4" />
                                  )
                                ) : (
                                  <FiChevronDown className="w-4 h-4 opacity-30" />
                                )}
                              </span>
                            )}
                          </div>
                          {column.Filter && (
                            <div className="mt-1">
                              {column.render("Filter")}
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.length > 0 ? (
                    page.map((row) => {
                      prepareRow(row)
                      return (
                        <motion.tr
                          {...row.getRowProps()}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50"
                        >
                          {row.cells.map((cell) => (
                            <td
                              {...cell.getCellProps()}
                              className="px-6 py-4 whitespace-nowrap text-sm"
                            >
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </motion.tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={columns.length}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No payments found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {pageIndex * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        (pageIndex + 1) * pageSize,
                        filteredData.length
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{filteredData.length}</span>{" "}
                    results
                  </span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value))
                    }}
                    className="border rounded text-sm p-1"
                  >
                    {[5, 10, 20, 30, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    className={`px-3 py-1 rounded ${
                      !canPreviousPage
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    <FiArrowLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                    // Show pages around current page
                    let pageNum
                    if (pageCount <= 5) {
                      pageNum = i
                    } else if (pageIndex <= 2) {
                      pageNum = i
                    } else if (pageIndex >= pageCount - 3) {
                      pageNum = pageCount - 5 + i
                    } else {
                      pageNum = pageIndex - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => gotoPage(pageNum)}
                        className={`px-3 py-1 rounded ${
                          pageIndex === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    className={`px-3 py-1 rounded ${
                      !canNextPage
                        ? "bg-gray-100 text-gray-400"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Detail Modal */}
      <AnimatePresence>
        {showModal && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Payment Details
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Taxpayer
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <FiUser className="mr-2" />
                        {selectedPayment.taxpayerName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedPayment.email}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Tax Category
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedPayment.taxCategory}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Amount Paid
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedPayment.amount.toLocaleString()} ETB
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Date & Time
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        <FiCalendar className="mr-2" />
                        {format(
                          parseISO(selectedPayment.date),
                          "MMM dd, yyyy hh:mm a"
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Payment Method
                      </h3>
                      <p className="mt-1 text-sm text-gray-900 flex items-center">
                        {selectedPayment.paymentMethod === "Card" && (
                          <FiCreditCard className="mr-2" />
                        )}
                        {selectedPayment.paymentMethod === "Bank Transfer" && (
                          <FiDollarSign className="mr-2" />
                        )}
                        {selectedPayment.paymentMethod === "Mobile Money" && (
                          <FiUser className="mr-2" />
                        )}
                        {selectedPayment.paymentMethod}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Status
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedPayment.status === "Success" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <FiCheckCircle className="mr-1" />
                            Success
                          </span>
                        )}
                        {selectedPayment.status === "Failed" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <FiXCircle className="mr-1" />
                            Failed
                          </span>
                        )}
                        {selectedPayment.status === "Pending" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <FiClock className="mr-1" />
                            Pending
                          </span>
                        )}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Transaction ID
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedPayment.id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500">
                    Reference No.
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPayment.referenceNo}
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500">
                    Description / Note
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPayment.description}
                  </p>
                </div>

                {selectedPayment.receiptUrl && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Receipt
                    </h3>
                    <a
                      href={selectedPayment.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <FiFileText className="mr-2" />
                      View/Download Receipt
                    </a>
                  </div>
                )}

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  {!selectedPayment.disputed && (
                    <button
                      type="button"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 flex items-center"
                      onClick={flagAsDisputed}
                    >
                      <FiFlag className="mr-2" />
                      Flag as Disputed
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PaymentLog
