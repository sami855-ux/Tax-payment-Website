import { useState, useMemo } from "react"
import { getRecentTaxFilingTableData } from "@/services/Tax"
import Table from "@/ui/Table"
import { useQuery } from "@tanstack/react-query"
import PaymentRow from "./PaymentRow"
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Filter,
  X,
} from "lucide-react"

export default function PaymentHistory() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" })
  const [filters, setFilters] = useState({
    paymentStatus: "",
    status: "",
    taxCategory: "",
    searchQuery: "",
  })

  const { data: paymentData = [], isLoading } = useQuery({
    queryKey: ["taxpayer-payment"],
    queryFn: getRecentTaxFilingTableData,
  })

  // Apply filters
  const filteredData = useMemo(() => {
    return paymentData.filter((item) => {
      return (
        (filters.paymentStatus === "" ||
          item.paymentStatus
            .toLowerCase()
            .includes(filters.paymentStatus.toLowerCase())) &&
        (filters.status === "" ||
          item.status.toLowerCase().includes(filters.status.toLowerCase())) &&
        (filters.taxCategory === "" ||
          item.taxCategory
            .toLowerCase()
            .includes(filters.taxCategory.toLowerCase())) &&
        (filters.searchQuery === "" ||
          item.taxpayerName
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()) ||
          item.referenceId
            .toLowerCase()
            .includes(filters.searchQuery.toLowerCase()))
      )
    })
  }, [paymentData, filters])

  // Apply sorting
  const sortedData = useMemo(() => {
    let sortableData = [...filteredData]
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableData
  }, [filteredData, sortConfig])

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
    setCurrentPage(1) // Reset to first page when filters change
  }

  const resetFilters = () => {
    setFilters({
      paymentStatus: "",
      status: "",
      taxCategory: "",
      searchQuery: "",
    })
    setCurrentPage(1)
  }

  const SortIndicator = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null
    return (
      <span className="ml-1">
        {sortConfig.direction === "asc" ? (
          <ArrowUp className="h-3 w-3 inline" />
        ) : (
          <ArrowDown className="h-3 w-3 inline" />
        )}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <h2 className="font-semibold text-lg text-gray-800 p-4">
        Filing History
      </h2>
      {/* Filter Controls */}
      <div className="p-4 border-b border-gray-300">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm"
              value={filters.searchQuery}
              onChange={(e) =>
                handleFilterChange("searchQuery", e.target.value)
              }
            />
            <Filter className="h-4 w-4 absolute left-2 top-3 text-gray-400" />
          </div>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.paymentStatus}
            onChange={(e) =>
              handleFilterChange("paymentStatus", e.target.value)
            }
          >
            <option value="">All Payment Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>

          <select
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={filters.taxCategory}
            onChange={(e) => handleFilterChange("taxCategory", e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="personal">Personal</option>
            <option value="business">Business</option>
            <option value="property">Property</option>
          </select>

          {(filters.paymentStatus ||
            filters.status ||
            filters.taxCategory ||
            filters.searchQuery) && (
            <button
              onClick={resetFilters}
              className="flex border-gray-300 items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table columns="2.5fr 1.5fr 1.2fr 0.9fr 1.2fr 1.3fr 1.1fr">
        <Table.Header>
          <div
            className="flex items-center cursor-pointer hover:text-blue-600"
            onClick={() => requestSort("referenceId")}
          >
            Reference ID
            <SortIndicator columnKey="referenceId" />
          </div>
          <div
            className="flex items-center cursor-pointer hover:text-blue-600"
            onClick={() => requestSort("taxpayerName")}
          >
            Taxpayer Name
            <SortIndicator columnKey="taxpayerName" />
          </div>
          <div
            className="flex items-center cursor-pointer hover:text-blue-600"
            onClick={() => requestSort("taxCategory")}
          >
            Tax Category
            <SortIndicator columnKey="taxCategory" />
          </div>
          <div
            className="flex items-center cursor-pointer hover:text-blue-600"
            onClick={() => requestSort("amount")}
          >
            Amount
            <SortIndicator columnKey="amount" />
          </div>
          <div
            className="flex items-center cursor-pointer hover:text-blue-600"
            onClick={() => requestSort("status")}
          >
            Status
            <SortIndicator columnKey="status" />
          </div>
          <div>Payment Purpose</div>
          <div
            className="flex items-center cursor-pointer hover:text-blue-600"
            onClick={() => requestSort("paymentStatus")}
          >
            Payment Status
            <SortIndicator columnKey="paymentStatus" />
          </div>
        </Table.Header>

        {!isLoading && (
          <Table.Body
            data={paginatedData}
            render={(data, dataIndex) => (
              <PaymentRow rowData={data} key={dataIndex} />
            )}
          />
        )}
      </Table>

      {/* Pagination Controls */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-300 bg-gray-50">
        <div className="flex-1 flex justify-between items-center sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages || totalPages === 0}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              results
            </p>

            <select
              className="ml-2 border rounded-md text-sm py-1 pl-2 pr-8"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
            >
              {[5, 10, 20, 50, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border rounded-md text-sm ${
                    currentPage === pageNum
                      ? "bg-blue-50 text-blue-600 border-blue-200"
                      : ""
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
