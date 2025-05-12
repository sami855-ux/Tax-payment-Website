import React, { useState } from "react"
import { useTable, useSortBy, useFilters, usePagination } from "react-table"
import { motion } from "framer-motion"
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiEye,
  FiEdit,
} from "react-icons/fi"

const VerifyTaxFilling = () => {
  const [selectedFiling, setSelectedFiling] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [actionType, setActionType] = useState("view") // 'view' or 'review'

  const data = React.useMemo(
    () => [
      {
        id: 1,
        taxpayer: "John Doe",
        tin: "123456789",
        taxType: "VAT",
        period: "Q1-2025",
        amount: "12,500 ETB",
        status: "pending",
        submittedOn: "Apr 20, 2025",
        documents: ["document1.pdf", "receipt1.jpg"],
      },
      {
        id: 2,
        taxpayer: "Mekdes B",
        tin: "987654321",
        taxType: "Income Tax",
        period: "FY-2024",
        amount: "75,000 ETB",
        status: "approved",
        submittedOn: "Mar 5, 2025",
        documents: ["income_statement.pdf"],
      },
      {
        id: 3,
        taxpayer: "Mekdes B",
        tin: "987654321",
        taxType: "Income Tax",
        period: "FY-2024",
        amount: "75,000 ETB",
        status: "approved",
        submittedOn: "Mar 5, 2025",
        documents: ["income_statement.pdf"],
      },
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: "Taxpayer",
        accessor: "taxpayer",
        Filter: TextFilter,
      },
      {
        Header: "Tax Type",
        accessor: "taxType",
        Filter: SelectFilter,
        filter: "includes",
      },
      {
        Header: "Period",
        accessor: "period",
      },
      {
        Header: "Declared Amount",
        accessor: "amount",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              value === "approved"
                ? "bg-green-100 text-green-800"
                : value === "rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        ),
        Filter: SelectFilter,
        filter: "includes",
      },
      {
        Header: "Submitted On",
        accessor: "submittedOn",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            {row.original.status === "pending" ? (
              <button
                onClick={() => {
                  setSelectedFiling(row.original)
                  setActionType("review")
                  setIsDrawerOpen(true)
                }}
                className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
              >
                <FiEdit className="mr-1" /> Review
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedFiling(row.original)
                  setActionType("view")
                  setIsDrawerOpen(true)
                }}
                className="flex items-center px-3 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                <FiEye className="mr-1" /> View
              </button>
            )}
          </div>
        ),
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data }, useFilters, useSortBy, usePagination)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-800">
            Filing Verification
          </h1>
          <p className="text-gray-600">
            Review and verify taxpayer submissions
          </p>
        </motion.div>

        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="relative w-64">
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
                        className="px-6 py-3 text-left text-[13px] font-medium text-gray-500 uppercase tracking-wider"
                      >
                        <div className="flex items-center">
                          {column.render("Header")}
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FiChevronDown className="ml-1 h-4 w-4" />
                            ) : (
                              <FiChevronUp className="ml-1 h-4 w-4" />
                            )
                          ) : (
                            ""
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
                      whileHover={{
                        backgroundColor: "rgba(243, 244, 246, 0.5)",
                      }}
                      className="hover:bg-gray-50"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-4 whitespace-nowrap text-[14px] text-gray-900"
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

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">
                    {pageIndex * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min((pageIndex + 1) * pageSize, data.length)}
                  </span>{" "}
                  of <span className="font-medium">{data.length}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">First</span>
                    &laquo;
                  </button>
                  <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    &lsaquo;
                  </button>
                  <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    &rsaquo;
                  </button>
                  <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Last</span>
                    &raquo;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filing Detail Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: isDrawerOpen ? 0 : "100%" }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50"
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {actionType === "review" ? "Review Filing" : "Filing Details"}
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedFiling && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Filing Overview
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Taxpayer</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFiling.taxpayer}
                        </p>
                        <p className="text-xs text-gray-500">
                          TIN: {selectedFiling.tin}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tax Category</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFiling.taxType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Period</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFiling.period}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Declared Amount</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFiling.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p
                          className={`text-sm font-medium ${
                            selectedFiling.status === "approved"
                              ? "text-green-600"
                              : selectedFiling.status === "rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {selectedFiling.status.charAt(0).toUpperCase() +
                            selectedFiling.status.slice(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Submitted On</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFiling.submittedOn}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Supporting Documents
                  </h3>
                  <div className="space-y-2">
                    {selectedFiling.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">
                          {doc}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                          <FiDownload className="mr-1" /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {actionType === "review" &&
                  selectedFiling.status === "pending" && (
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Verification
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Decision
                          </label>
                          <select
                            id="status"
                            name="status"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="approved">✅ Approve</option>
                            <option value="rejected">❌ Reject</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="notes"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Notes
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Add verification notes or reason for rejection"
                          ></textarea>
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsDrawerOpen(false)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Submit Decision
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      {isDrawerOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  )
}

// Helper components for filters
const TextFilter = ({ column }) => {
  const { filterValue, setFilter } = column
  return (
    <input
      type="text"
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value)}
      placeholder="Search..."
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    />
  )
}

const SelectFilter = ({ column }) => {
  const { filterValue, setFilter, preFilteredRows, id } = column
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach((row) => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  return (
    <select
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export default VerifyTaxFilling
