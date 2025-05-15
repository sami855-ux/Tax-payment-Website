import React, { useEffect, useState } from "react"
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
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { assignedTaxFillings, reviewTaxFiling } from "@/services/Tax"
import Spinner from "@/ui/Spinner"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

const VerifyTaxFilling = () => {
  const { data: fillingData, isLoading } = useQuery({
    queryKey: ["assigned-filling"],
    queryFn: assignedTaxFillings,
  })
  const queryClient = useQueryClient()
  const [selectedFiling, setSelectedFiling] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [actionType, setActionType] = useState("view")
  const [action, setAction] = useState("approved")
  const [remark, setRemark] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const data = React.useMemo(() => {
    if (!fillingData) return []

    return fillingData.map((filing) => ({
      id: filing.id, // or filing.id depending on your API
      taxpayer: filing.taxpayer || filing.user?.name || "N/A",
      tin: filing.tin || filing.taxId || "N/A",
      taxType: filing.taxType || filing.category || "N/A",
      period: filing.period || `${filing.year}-Q${filing.quarter}` || "N/A",
      amount: filing.amount ? `${filing.amount.toLocaleString()}` : "N/A",
      status: filing.status || "pending",
      submittedOn: filing.submittedOn
        ? new Date(filing.submittedOn).toLocaleDateString()
        : "N/A",
      documents: filing.documentFiled || [],
      taxpayerId: filing.taxpayerId,
    }))
  }, [fillingData])

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
            {row.original.status === "submitted" ? (
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

  const handleReview = async () => {
    const reviewData = {
      userId: selectedFiling.taxpayerId,
      filingId: selectedFiling.id,
      decision: action,
      remarks: remark,
    }
    try {
      setIsSubmitting(true)
      const res = await reviewTaxFiling(reviewData)

      if (res.success) {
        toast.success(res.message)
        setSelectedFiling()
        setIsDrawerOpen(false)
        setAction("approved")
        setRemark("")
        queryClient.invalidateQueries(["assigned-filling"])
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    document.title = "Verify tax filling"
  }, [])

  if (isLoading) return <Spinner />

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
