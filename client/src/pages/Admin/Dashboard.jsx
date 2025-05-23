import { useEffect } from "react"

import PaymentHistory from "../../components/PaymentHistory"
import Widgets from "../../components/Widgets"
import Chart from "./Chart"

export default function Dashboard() {
  useEffect(() => {
    document.title = "Admin dashboard"
  }, [])

  return (
    <div className="w-screen md:w-full p-4 bg-white min-h-screen">
      <section className="w-full h-14 flex items-center justify-between pr-5 py-3">
        <h2 className="font-semibold text-xl text-gray-800">Dashboard</h2>
      </section>
      <Widgets />
      <Chart />
      <div className="w-screen md:w-full mt-7 mb-4 bg-white pb-5 overflow-x-scroll h-1/2">
        <PaymentHistory />
      </div>
    </div>
  )
}
