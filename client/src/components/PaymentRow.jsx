import Table from "@/ui/Table"
import { useEffect } from "react"
import { cn } from "@/helpers/util"

export default function PaymentRow({ rowData }) {
  const {
    taxpayerName: fullName,
    referenceId,
    taxCategory,
    amount,
    status,
    paymentStatus,
    paymentPurpose,
  } = rowData

  useEffect(() => {
    console.log("Payment row data:", rowData)
  }, [rowData])

  const statusStyles = {
    pending: "bg-amber-100 text-amber-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    processing: "bg-blue-100 text-blue-800",
  }

  const paymentStatusStyles = {
    pending: "bg-amber-100 text-amber-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
  }

  return (
    <Table.Row className="hover:bg-gray-50 transition-colors">
      <div className="py-2">
        <p className="text-sm font-medium text-gray-900 font-mono">
          {referenceId}
        </p>
      </div>

      <div className="py-2 px-2">
        <p className="text-sm font-medium text-gray-900 capitalize">
          {fullName}
        </p>
      </div>

      <div className="py-2 px-2">
        <p className="text-sm text-gray-500 capitalize">{taxCategory}</p>
      </div>

      <div className="py-2 w-28">
        <p className="text-sm font-semibold text-gray-900 text-left">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "ETB",
          }).format(amount)}
        </p>
      </div>

      <div className="py-2 ">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            statusStyles[status.toLowerCase()] || "bg-gray-100 text-gray-800"
          )}
        >
          {status}
        </span>
      </div>

      <div className="py-2 px-2">
        <p className="text-[15px] text-gray-500 capitalize">{paymentPurpose}</p>
      </div>

      <div className="py-2 px-2">
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            paymentStatusStyles[paymentStatus.toLowerCase()] ||
              "bg-gray-100 text-gray-800"
          )}
        >
          {paymentStatus}
        </span>
      </div>
    </Table.Row>
  )
}
