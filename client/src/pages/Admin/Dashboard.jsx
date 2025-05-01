import { useDispatch } from "react-redux"
import { useEffect } from "react"

import PaymentHistory from "../../components/PaymentHistory"
import { getUserById } from "@/services/apiUser"
import { login } from "@/redux/slice/userSlice"
import Widgets from "../../components/Widgets"
import Chart from "./Chart"

export default function Dashboard() {
  const dispatch = useDispatch()

  useEffect(() => {
    document.title = "Admin dashboard"

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
    <div className="w-screen md:w-full p-4 bg-gray-300 min-h-screen">
      <section className="w-full h-14 flex items-center justify-between pr-5 py-3">
        <h2 className="font-semibold text-xl text-gray-800">Dashboard</h2>
      </section>
      <Widgets />
      <Chart />
      <div className="w-screen md:w-full mt-7 mb-4 bg-white pb-5 overflow-x-scroll">
        <PaymentHistory />
      </div>
    </div>
  )
}
