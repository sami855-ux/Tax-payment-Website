"use client"

import { useState } from "react"

export default function BillingReceiptPreview() {
  const [billingDetails] = useState({
    name: "John Doe",
    address: "123 Main St, Cityville, CA 90001",
    email: "johndoe@example.com",
    phone: "+1 234 567 8901",
  })

  const [receiptDetails] = useState({
    taxType: "Income Tax",
    period: "January - March 2025",
    amount: "$1,200.00",
    paymentMethod: "Credit Card (Visa **** 4242)",
    transactionDate: "April 26, 2025",
    receiptNumber: "TXP-20250426-001",
  })

  return (
    <div className=" w-[90%]  px-6 py-12 bg-white rounded-3xl shadow-2xl space-y-12">
      {/* Page Title */}
      <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
        Billing & Receipt Preview
      </h2>

      {/* Billing and Receipt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Billing Details Card */}
        <div className="rounded-2xl border border-gray-200 p-8  hover:shadow-md transition-all">
          <h3 className="text-xl font-semibold text-blue-600 mb-6">
            Billing Details
          </h3>
          <InfoRow label="Name" value={billingDetails.name} />
          <InfoRow label="Address" value={billingDetails.address} />
          <InfoRow label="Email" value={billingDetails.email} />
          <InfoRow label="Phone" value={billingDetails.phone} />
        </div>

        {/* Receipt Details Card */}
        <div className="rounded-2xl border-2 border-gray-200 p-8 shadow-md hover:shadow-xl transition-all">
          <h3 className="text-xl font-semibold text-green-600 mb-6">
            Receipt Details
          </h3>
          <InfoRow label="Tax Type" value={receiptDetails.taxType} />
          <InfoRow label="Period" value={receiptDetails.period} />
          <InfoRow label="Amount" value={receiptDetails.amount} />
          <InfoRow
            label="Payment Method"
            value={receiptDetails.paymentMethod}
          />
          <InfoRow
            label="Transaction Date"
            value={receiptDetails.transactionDate}
          />
          <InfoRow
            label="Receipt Number"
            value={receiptDetails.receiptNumber}
          />
        </div>
      </div>
    </div>
  )
}

// InfoRow Sub-component
function InfoRow({ label, value }) {
  return (
    <div className="mb-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-[16px] text-gray-800 font-semibold">{value}</div>
    </div>
  )
}
