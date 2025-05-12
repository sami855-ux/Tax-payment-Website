import { motion } from "framer-motion"

import TaxpayerRow from "@/components/TaxpayerRow"
import Menus from "@/ui/Menus"
import Table from "@/ui/Table"
import { FiFilter, FiSearch } from "react-icons/fi"

const dummyData = [
  {
    name: "John Doe",
    tin: "TIN12345678",
    kebele: "Kebele 5",
    phone: "+251912345678",
    filingStatus: "Compliant",
    outstandingPayments: 200000,
    lastFilingDate: "2025-04-10",
    noticesSent: 2,
  },
  {
    name: "Mary Smith",
    tin: "TIN87654321",
    kebele: "Kebele 10",
    phone: "+251900456789",
    filingStatus: "Pending",
    outstandingPayments: 500000,
    lastFilingDate: "2025-03-15",
    noticesSent: 1,
  },
  {
    name: "Samuel Bekele",
    tin: "TIN11223344",
    kebele: "Kebele 7",
    phone: "+251911223344",
    filingStatus: "Overdue",
    outstandingPayments: 750000,
    lastFilingDate: "2025-02-20",
    noticesSent: 3,
  },
  {
    name: "Liya Alemu",
    tin: "TIN99887766",
    kebele: "Kebele 2",
    phone: "+251913556677",
    filingStatus: "Compliant",
    outstandingPayments: 0,
    lastFilingDate: "2025-04-25",
    noticesSent: 0,
  },
  {
    name: "Yared Mesfin",
    tin: "TIN44556677",
    kebele: "Kebele 12",
    phone: "+251922334455",
    filingStatus: "Pending",
    outstandingPayments: 320000,
    lastFilingDate: "2025-03-30",
    noticesSent: 1,
  },
]

export default function Taxpayer() {
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
          <Table columns="1.2fr 1.2fr 1fr 1.1fr 1.3fr 1.1fr 1.3fr 0.5fr 0.2fr">
            <Table.Header>
              <div>Taxpayer name</div>
              <div>TIN</div>
              <div>Kebele</div>
              <div>Phone</div>
              <div>Filling status</div>
              <div>Outstanding payment</div>
              <div>Last Filling Date</div>
              <div>Notice sent</div>
              <div></div>
            </Table.Header>

            <Table.Body
              data={dummyData}
              render={(data, dataIndex) => (
                <TaxpayerRow rowData={data} key={dataIndex} />
              )}
            />
          </Table>
        </Menus>
      </motion.div>
    </div>
  )
}
