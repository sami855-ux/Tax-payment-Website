import { useDispatch } from "react-redux"
import { useEffect } from "react"

import { AiOutlineFileSearch } from "react-icons/ai"
import { FaArrowUp, FaCoins } from "react-icons/fa"
import { getUserById } from "@/services/apiUser"
import { login } from "@/redux/slice/userSlice"
import HistoryTable from "./HistoryTable"
import { BsTags } from "react-icons/bs"
import LineChart from "./LineChart"
import PieChart from "./PieChart"
import Button from "@/ui/Button"

export default function UserDashboard() {
  const dispatch = useDispatch()

  useEffect(() => {
    document.title = "Dashboard"

    const getUserInfo = async () => {
      const res = await getUserById()

      if (res.success) {
        dispatch(
          login({
            user: res.user,
          })
        )
      }
    }

    getUserInfo()
  }, [])

  return (
    <div className="bg-gray-300 min-h-screen p-4">
      <section className="w-full h-14 flex items-center justify-between pr-5 py-3">
        <h2 className="font-semibold text-xl text-gray-800">Dashboard</h2>
      </section>

      <div className="w-full min-h-56  flex flex-wrap gap-3 mb-7 items-center justify-center">
        <HeaderDashboard />
        <section className="h-full w-full md:w-80 lg:w-[270px] bg-gray-400 rounded-md px-6 py-5 bg-gradient-to-r from-blue-700  to-blue-600">
          <div className="w-full h-16 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-white">Total tax paid</h2>
            <FaCoins
              size={32}
              color="white
            "
            />
          </div>
          <p className="text-3xl font-semibold text-white">450,000 birr</p>
          <p className="text-sm text-gray-200 py-6 flex items-center gap-1">
            <FaArrowUp color="white" />
            <span className="text-white">6.56% from last year</span>
          </p>
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
          <p className="text-3xl font-semibold text-gray-800">3 </p>
          <p className="text-sm text-gray-700 pt-6 flex items-center gap-1">
            Complete your filings before the due date
          </p>
        </section>
        <section className="h-full w-full md:w-[400px] lg:w-[270px] bg-gray-100 rounded-md px-6 py-2 lg:py-5">
          <div className="w-full h-16 flex items-center justify-between">
            <h2 className="font-semibold text-lg text-gary-700">Income Tax</h2>
            <span className="bg-blue-300 w-12 h-12 rounded-full flex items-center justify-center">
              <BsTags size={30} color="blue" />
            </span>
          </div>
          <p className="text-3xl font-semibold text-gray-800">3 </p>
          <p className="text-sm text-gray-700 py-6 flex items-center gap-1">
            2 filings due in this category
          </p>
        </section>
      </div>

      <div className="w-full flex flex-col md:flex-row gap-7 min-h-[400px]">
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
      </div>
      <div className="w-full flex flex-col bg-white mt-6 rounded-lg gap-7 h-[400px] p-5">
        <h2 className="font-semibold text-xl text-gray-700">
          {" "}
          Payment History
        </h2>

        <div className="w-full overflow-x-scroll h-[50vh]">
          <HistoryTable />
        </div>
      </div>
    </div>
  )
}

const HeaderDashboard = () => {
  return (
    <div className="h-52 md:w-[450px] lg:w-80 rounded-md bg-white flex gap-2">
      <section className="p-3">
        <h2 className="font-semibold text-xl py-3 text-gray-800">
          Professional Invoices Made
        </h2>
        <p className="text-[15px] text-gray-600 pb-5">
          Quickly understand who your best customers little and motivation to
          pay thair bills.
        </p>
        <Button text="Watch More" />
      </section>
    </div>
  )
}
