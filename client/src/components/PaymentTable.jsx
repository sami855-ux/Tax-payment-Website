import React, { useMemo, useState } from "react"
import { useTable, useSortBy, usePagination, useFilters } from "react-table"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  FiChevronUp,
  FiChevronDown,
  FiFilter,
  FiSearch,
  FiDownload,
  FiCheck,
  FiX,
  FiEdit,
  FiEye,
  FiSend,
} from "react-icons/fi"

const PaymentTable = ({ data, onVerify, onView, onSendReminder }) => {
  const [filterInput, setFilterInput] = useState("")

  const columns = useMemo(
    () => [
      {
        Header: "Payment ID",
        accessor: "paymentId",
        Cell: ({ value }) => (
          <span className="font-mono text-blue-600">{value}</span>
        ),
      },
      {
        Header: "Taxpayer Name",
        accessor: "taxpayerName",
      },
      {
        Header: "Tax Type",
        accessor: "taxType",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: ({ value }) => (
          <span className="font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(value)}
          </span>
        ),
      },
      {
        Header: "Date Paid",
        accessor: "datePaid",
        Cell: ({ value }) => format(new Date(value), "MMM dd, yyyy"),
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              value === "Verified"
                ? "bg-green-100 text-green-800"
                : value === "Pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        ),
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => onView(row.original)}
              className="p-1 text-blue-500 hover:text-blue-700"
              title="View Details"
            >
              <FiEye size={16} />
            </button>
            {row.original.status === "Pending" && (
              <>
                <button
                  onClick={() => onVerify(row.original.paymentId, true)}
                  className="p-1 text-green-500 hover:text-green-700"
                  title="Approve"
                >
                  <FiCheck size={16} />
                </button>
                <button
                  onClick={() => onVerify(row.original.paymentId, false)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Reject"
                >
                  <FiX size={16} />
                </button>
              </>
            )}
            <button
              onClick={() => onSendReminder(row.original.taxpayerId)}
              className="p-1 text-purple-500 hover:text-purple-700"
              title="Send Reminder"
            >
              <FiSend size={16} />
            </button>
          </div>
        ),
        disableSortBy: true,
      },
    ],
    []
  )

  // Define a default UI for filtering
  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" size={14} />
        </div>
        <input
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value || undefined)
          }}
          placeholder={`Search...`}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    )
  }

  function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    const options = useMemo(() => {
      const options = new Set()
      preFilteredRows.forEach((row) => {
        options.add(row.values[id])
      })
      return [...options.values()]
    }, [id, preFilteredRows])

    return (
      <select
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined)
        }}
        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
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
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useSortBy,
    usePagination
  )

  // Update the filter when search input changes
  const handleFilterChange = (e) => {
    const value = e.target.value || undefined
    setFilter("taxpayerName", value)
    setFilterInput(value)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="bg-white rounded-lg shadow overflow-hidden"
    >
      {/* Table Header with Search */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div className="relative w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" size={16} />
          </div>
          <input
            value={filterInput}
            onChange={handleFilterChange}
            placeholder="Search taxpayer..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Table */}
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
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.render("Header")}</span>
                      {column.canSort && (
                        <span>
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <FiChevronDown size={14} />
                            ) : (
                              <FiChevronUp size={14} />
                            )
                          ) : (
                            <FiChevronDown size={14} className="opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                    {column.canFilter && (
                      <div className="mt-1">{column.render("Filter")}</div>
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
            {page.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {cell.render("Cell")}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200 bg-gray-50">
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
              <span className="font-medium">{pageIndex * pageSize + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, data.length)}
              </span>{" "}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              First
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="flex items-center px-3 py-1 text-sm text-gray-700">
              Page {pageIndex + 1} of {pageOptions.length}
            </span>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Last
            </button>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
              }}
              className="ml-2 block pl-3 pr-10 py-1 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="px-6 py-3 bg-gray-50 text-right border-t border-gray-200">
        <button
          onClick={() => alert("Export functionality would go here")}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiDownload className="mr-2" size={16} />
          Export to CSV
        </button>
      </div>
    </motion.div>
  )
}

export default PaymentTable
