import { motion } from "framer-motion"

import TaxpayerRow from "@/components/TaxpayerRow"
import Menus from "@/ui/Menus"
import Table from "@/ui/Table"
import { FiFilter, FiSearch } from "react-icons/fi"
import { useQuery } from "@tanstack/react-query"
import { getTaxpayersByOfficial } from "@/services/apiUser"
import Spinner from "@/ui/Spinner"
import { useEffect } from "react"

export default function Taxpayer() {
  const { isLoading, data } = useQuery({
    queryKey: ["assigned-taxpayers"],
    queryFn: getTaxpayersByOfficial,
  })

  useEffect(() => {
    document.title = "Assigned taxpayers"
  }, [])
  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className=" pb-4 mb-4 "
      >
        <h1 className="text-2xl font-bold text-gray-800">Assigned Taxpayers</h1>
        <p className="text-gray-600">Review and verify taxpayer submissions</p>
      </motion.div>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className=" border border-gray-200 rounded-2xl"
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
        <Menus>
          <Table columns="1.5fr 1.2fr 1fr 1.5fr 1.3fr 1.5fr 1fr 0.2fr">
            <Table.Header>
              <div>Taxpayer name</div>
              <div>TIN</div>
              <div>Kebele</div>
              <div>Phone</div>
              <div>Setup</div>
              <div>Last Filling Date</div>
              <div>Notice sent</div>
              <div></div>
            </Table.Header>

            {isLoading ? (
              <Spinner />
            ) : (
              <Table.Body
                data={data}
                render={(data, dataIndex) => (
                  <TaxpayerRow rowData={data} key={dataIndex} />
                )}
              />
            )}
          </Table>
        </Menus>
      </motion.div>
    </div>
  )
}
