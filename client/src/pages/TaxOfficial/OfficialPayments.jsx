import React from "react"
import { motion } from "framer-motion"
import PaymentTable from "@/components/PaymentTable"

const OfficialPayments = () => {
  // Sample data - replace with your actual data
  const paymentData = [
    {
      paymentId: "TXP123",
      taxpayerName: "John Doe",
      taxType: "VAT",
      amount: 12000,
      datePaid: "2025-04-20",
      paymentMethod: "Bank Transfer",
      status: "Verified",
      taxpayerId: "TP123",
    },
    {
      paymentId: "TXP124",
      taxpayerName: "Jane Smith",
      taxType: "Income Tax",
      amount: 18500,
      datePaid: "2025-04-22",
      paymentMethod: "Credit Card",
      status: "Pending",
      taxpayerId: "TP124",
    },
    {
      paymentId: "TXP123",
      taxpayerName: "John Doe",
      taxType: "VAT",
      amount: 12000,
      datePaid: "2025-04-20",
      paymentMethod: "Bank Transfer",
      status: "Verified",
      taxpayerId: "TP123",
    },
    {
      paymentId: "TXP124",
      taxpayerName: "Jane Smith",
      taxType: "Income Tax",
      amount: 18500,
      datePaid: "2025-04-22",
      paymentMethod: "Credit Card",
      status: "Pending",
      taxpayerId: "TP124",
    },
    // Add more data as needed
  ]

  const handleVerify = (paymentId, isApproved) => {
    console.log(`Payment ${paymentId} ${isApproved ? "approved" : "rejected"}`)
    // Add your verification logic here
  }

  const handleView = (payment) => {
    console.log("View payment:", payment)
    // Add your view logic here
  }

  const handleSendReminder = (taxpayerId) => {
    console.log("Send reminder to taxpayer:", taxpayerId)
    // Add your reminder logic here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-800">Tax Payments</h1>
        <p className="text-gray-600">Review and verify taxpayer submissions</p>
      </motion.div>
      <PaymentTable
        data={paymentData}
        onVerify={handleVerify}
        onView={handleView}
        onSendReminder={handleSendReminder}
      />
    </div>
  )
}

export default OfficialPayments
