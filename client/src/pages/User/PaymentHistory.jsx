import HistoryTable from "./HistoryTable"

export default function PaymentHistory() {
  return (
    <div className="bg-gray-300 min-h-screen p-4">
      <section className="w-full h-14 flex items-center justify-between pr-5 py-3">
        <h2 className="font-semibold text-xl text-gray-800">Payment History</h2>
      </section>

      <div className="w-full overflow-x-scroll h-fit mt-7">
        <HistoryTable />
      </div>
    </div>
  )
}
