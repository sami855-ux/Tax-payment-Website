import { useState, useMemo, useEffect } from "react"
import { useTable, useFilters, usePagination, useSortBy } from "react-table"
import { motion, AnimatePresence } from "framer-motion"
import { format, parseISO } from "date-fns"
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
  FiChevronDown,
  FiChevronUp,
  FiExternalLink,
  FiArrowLeft,
  FiArrowRight,
  FiFlag,
} from "react-icons/fi"
import { useQuery } from "@tanstack/react-query"
import { getAllPaymentsForAdmin } from "@/services/Tax"

const PaymentLog = () => {
  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ["taxpayer-payments"],
    queryFn: getAllPaymentsForAdmin,
  })

  const [data, setData] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Set data from query when loaded
  useEffect(() => {
    if (paymentsData) {
      setData(paymentsData)
    }
  }, [paymentsData])

  const filteredData = useMemo(() => {
    if (!data) return []
    return data.filter(
      (payment) =>
        payment.taxpayerName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.taxCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.status?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  const columns = useMemo(
    () => [
      {
        Header: "Taxpayer",
        accessor: "taxpayerName",
        Cell: ({ value }) => <span className="font-medium">{value}</span>,
      },
      {
        Header: "Category",
        accessor: "taxCategory",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => <span>{value?.toLocaleString()} ETB</span>,
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) =>
          value ? format(parseISO(value), "MMM dd, yyyy") : "-",
      },
      {
        Header: "Method",
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
      },
    ],
    []
  )

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
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useFilters,
    useSortBy,
    usePagination
  )

  const flagAsDisputed = () => {
    if (!selectedPayment) return
    setData((prevData) =>
      prevData.map((item) =>
        item.id === selectedPayment.id ? { ...item, disputed: true } : item
      )
    )
    setSelectedPayment((prev) => (prev ? { ...prev, disputed: true } : null))
    setShowModal(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 md:mb-0">
              Payment Logs
            </h1>
            <p className="text-gray-500 mb-4 pt-4">
              Track and monitor all financial transactions in real-time.
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
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
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-gray-200"
                >
                  {page.map((row) => {
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
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Page{" "}
                  <span className="font-medium">
                    {pageIndex + 1} of {pageOptions.length}
                  </span>
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border rounded text-sm p-1"
                >
                  {[5, 10, 20].map((size) => (
                    <option key={size} value={size}>
                      Show {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                  className={`px-3 py-1 rounded ${
                    !canPreviousPage
                      ? "bg-gray-100 text-gray-400"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <FiArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => nextPage()}
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
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
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

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Taxpayer
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPayment.taxpayerName}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Amount
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPayment.amount?.toLocaleString()} ETB
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Status
                    </h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedPayment.status}
                    </p>
                  </div>
                  {selectedPayment.receiptUrl && (
                    <div>
                      <a
                        href={selectedPayment.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        <FiFileText className="mr-2" />
                        View Receipt
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {!selectedPayment.disputed && (
                    <button
                      onClick={flagAsDisputed}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
                    >
                      <FiFlag className="mr-2" />
                      Flag Dispute
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
