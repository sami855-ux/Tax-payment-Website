import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import {
  clearNotifications,
  fetchNotifications,
} from "@/redux/slice/notificationSlice"
import { checkTaxSetup } from "@/services/notification"
import { AiOutlineFileSearch } from "react-icons/ai"
import { FaArrowUp, FaCoins } from "react-icons/fa"
import { getUserById } from "@/services/apiUser"
import { login } from "@/redux/slice/userSlice"
import HistoryTable from "./HistoryTable"
import { BsTags } from "react-icons/bs"
import LineChart from "./LineChart"
import PieChart from "./PieChart"
import Button from "@/ui/Button"
import { fetchPendingTaxFilings, getPendingTaxSchedules } from "@/services/Tax"
import { CalendarDays, Loader } from "lucide-react"
import useUserPayments from "@/context/useUserPayment"

export default function UserDashboard() {
  const { data: dataPayment, isLoading } = useUserPayments()
  const { user } = useSelector((store) => store.user)

  const totalTax = dataPayment?.reduce((acc, item) => acc + item.amount, 0)

  const dispatch = useDispatch()

  const [pending, setPending] = useState([])

  useEffect(() => {
    document.title = "Dashboard"

    const handleNotification = async () => {
      await checkTaxSetup()
    }

    const handlePending = async () => {
      const res = await fetchPendingTaxFilings()
      console.log(res)
      setPending(res.filings)
    }

    handleNotification()
    handlePending()
    dispatch(fetchNotifications())
  }, [dispatch])

  return (
    <div className="bg-white min-h-screen p-6">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-14  pr-5 py-3"
      >
        <h2 className="font-semibold text-3xl text-gray-800 pb-2">Dashboard</h2>
        <p className="text-gray-700">
          Set up your account and get ready to pay taxes.
        </p>
      </motion.section>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-full min-h-56  flex flex-wrap gap-3 mb-7 items-center "
      >
        <section className="h-full w-full md:w-80 lg:w-[270px] bg-gray-400 rounded-md px-6 py-5 bg-gradient-to-r from-blue-700  to-blue-600">
          <div className="w-full h-16 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-white">Total tax paid</h2>
            <FaCoins
              size={32}
              color="white
            "
            />
          </div>
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              <p className="text-3xl font-semibold text-white">
                {totalTax} birr
              </p>
              <p className="text-sm text-gray-200 py-6 flex items-center gap-1">
                <FaArrowUp color="white" />
                <span className="text-white">6.56% from last year</span>
              </p>
            </>
          )}
        </section>
        <section className="h-full w-full md:w-[370px] lg:w-[270px] bg-gray-100 rounded-md px-6 py-5">
          <div className="w-full h-16 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-gary-700">
              Pending Filling
            </h2>
            <span className="bg-blue-300 w-12 h-12 rounded-full flex items-center justify-center">
              <AiOutlineFileSearch size={30} color="blue" />
            </span>
          </div>
          <p className="text-3xl font-semibold text-gray-800">
            {pending?.length}{" "}
          </p>
          <p className="text-sm text-gray-700 pt-6 flex items-center gap-1">
            Complete your filings before the due date
          </p>
        </section>
        <section className="h-full w-full md:w-[400px] lg:w-[270px] bg-gray-100 rounded-md px-6 py-2 lg:py-5">
          <div className="w-full h-16 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-gary-700">
              Total tax categories
            </h2>
            <span className="bg-blue-300 w-12 h-12 rounded-full flex items-center justify-center">
              <BsTags size={30} color="blue" />
            </span>
          </div>
          <p className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            {user?.taxCategories.length}{" "}
            <span className="bg-green-200 text-green-600 py-1 text-[14px] px-4 rounded-2xl">
              active
            </span>
          </p>
          <p className="text-sm text-gray-700 py-6 flex items-center gap-1">
            {user?.taxCategories.map((tax, taxIndex) => (
              <span Key={taxIndex} className="capitalize">
                {" "}
                {tax},
              </span>
            ))}
          </p>
        </section>
        <div className="h-52 md:w-[450px] lg:w-80 rounded-md bg-gray-100 border-gray-300 flex gap-2 pt-2">
          <div className="flex p-6 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-gray-700 mb-4">
                  Next Due Date
                </p>
                <span className="px-3 mb-7 text-[14px] bg-amber-200 rounded-full ">
                  {pending.length === 0 ? null : pending.length}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-blue-900">
                {pending && pending.length > 0 ? (
                  pending?.slice(0, 2).map((data, dataIndex) => (
                    <div
                      key={dataIndex}
                      className="flex items-center py-2 px-3 mb-2 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-blue-900">
                        <span className="font-semibold text-blue-700 capitalize">
                          {data.taxCategory}
                        </span>
                        <span className="text-blue-600 mx-1">tax due on</span>
                        <span className="font-medium text-blue-800">
                          {new Date(data.filingDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                    <svg
                      className="w-5 h-5 text-gray-500 mr-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm font-medium text-gray-600">
                      No upcoming due dates
                    </p>
                  </div>
                )}
              </h3>
            </div>
            <CalendarDays className="w-10 h-10 text-blue-700" />
          </div>
        </div>
      </motion.div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-full flex flex-col md:flex-row gap-7 min-h-[400px]"
      >
        <section className="md:h-full h-[400px] w-full md:w-[55%] lg:w-[65%] bg-gray-100 rounded-lg">
          <LineChart />
        </section>
        <section className="h-[400px] md:h-full w-full md:[45%] lg:w-[32%] bg-gray-100 rounded-lg">
          <PieChart />
          <p className="text-center text-[14px]">
            <span className="font-semibold">50%</span> more taxes than last
            month{" "}
          </p>
        </section>
      </motion.div>
      <div className="w-full flex flex-col bg-white mt-6 rounded-lg gap-7 h-fit p-5">
        <h2 className="font-semibold text-xl text-gray-700">
          {" "}
          Payment History
        </h2>

        <div className="w-full overflow-x-scroll h-[500px]">
          <HistoryTable path="not" />
        </div>
      </div>
    </div>
  )
}
