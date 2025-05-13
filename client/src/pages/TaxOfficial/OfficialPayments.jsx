import React from "react"
import { motion } from "framer-motion"
import PaymentTable from "@/components/PaymentTable"
import { useQuery } from "@tanstack/react-query"
import { getPaymentsForOfficial } from "@/services/Tax"
import Spinner from "@/ui/Spinner"

const OfficialPayments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["assigned-payment"],
    queryFn: getPaymentsForOfficial,
  })

  console.log(data)
  // Sample data - replace with your actual data

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
      {isLoading ? (
        <Spinner />
      ) : (
        <PaymentTable
          data={data}
          onVerify={handleVerify}
          onView={handleView}
          onSendReminder={handleSendReminder}
        />
      )}
    </div>
  )
}

export default OfficialPayments
