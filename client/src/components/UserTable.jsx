import { useQuery } from "@tanstack/react-query"
import { Loader2, Search } from "lucide-react"
import { useMemo, useState } from "react"

import { getAllUsers } from "@/services/apiUser"
import UserRow from "./UserRow"
import Table from "@/ui/Table"
import Menus from "@/ui/Menus"

export default function UserTable() {
  const { isLoading, data } = useQuery({
    queryKey: ["users-admin"],
    queryFn: getAllUsers,
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const filteredData = useMemo(() => {
    if (!data?.users) return []

    const filtered = data.users.filter((user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const sorted = [...filtered].sort((a, b) => {
      const nameA = a.fullName.toLowerCase()
      const nameB = b.fullName.toLowerCase()
      if (sortOrder === "asc") {
        return nameA > nameB ? 1 : nameA < nameB ? -1 : 0
      } else {
        return nameA < nameB ? 1 : nameA > nameB ? -1 : 0
      }
    })

    return sorted
  }, [data, searchTerm, sortOrder])

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Determine which page numbers to show (previous, current, next)
  const pageNumbers = []
  if (currentPage > 1) pageNumbers.push(currentPage - 1)
  pageNumbers.push(currentPage)
  if (currentPage < totalPages) pageNumbers.push(currentPage + 1)

  if (isLoading)
    return (
      <div className="w-full ">
        <Loader2 className="animate-spin text-gray-500 w-10 h-10 mx-auto mt-10" />
      </div>
    )

  return (
    <>
      {/* Filter here */}
      <div className="w-full h-16 flex items-center justify-between px-6">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            className="w-full px-6 py-2 pl-10 pr-4 border border-gray-300 rounded-lg shadow-sm outline-none "
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <div className="relative">
          <label className="px-4">Sort</label>
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
            className="px-4 w-32 py-2 border border-gray-300 rounded-lg  bg-white text-gray-700"
          >
            <option value="asc">A-Z</option>
            <option value="desc">Z-A</option>
          </select>
        </div>
      </div>
      <Menus>
        <Table columns="1.7fr 0.5fr 1.7fr 1.3fr 1fr 1fr 0.5fr">
          <Table.Header>
            <div>Name</div>
            <div>Gender</div>
            <div>Email</div>
            <div>tax id</div>
            <div>Phone Number</div>
            <div>Role</div>
            <div></div>
          </Table.Header>

          <Table.Body
            data={currentItems}
            render={(data, dataIndex) => (
              <UserRow rowData={data} key={dataIndex} />
            )}
          />
        </Table>
      </Menus>

      {data?.users?.length > 0 && (
        <div className="mt-6 flex justify-between items-center px-7">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-9 cursor-pointer py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>

            {/* Show only previous, current, and next page numbers */}
            <div className="flex space-x-1">
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-2 rounded-full cursor-pointer text-sm font-semibold ${
                    currentPage === number
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-9 cursor-pointer py-2 bg-gray-300 text-gray-600 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </>
  )
}
