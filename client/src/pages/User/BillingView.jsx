import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, CreditCard, User, Home, Mail, Phone } from "lucide-react"

export default function BillingReceiptPreview() {
  const [billingDetails] = useState({
    name: "Bantelay D.",
    address: "mengetaya, debre brihan, ethiopia",
    email: "bantelay@gmail.com",
    phone: "+251 9999 999",
  })

  const [receiptDetails] = useState({
    taxType: "Income Tax",
    period: "January - March 2025",
    amount: "birr 1,200.00",
    paymentMethod: "Telebirr",
    transactionDate: "April 26, 2025",
    receiptNumber: "TXP-20250426-001",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl w-full px-6 pb-8 bg-white  space-y-8"
    >
      {/* Header with icon */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Billing & Receipt Example
        </h2>
        <p className="text-gray-500">Transaction summary</p>
      </motion.div>

      {/* Cards container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Billing Details */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl border border-gray-100 p-6 bg-gradient-to-br from-white to-gray-50"
        >
          <div className="flex items-center gap-3 mb-5">
            <User className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-700">
              Billing Details
            </h3>
          </div>
          <div className="space-y-4">
            <InfoRow
              icon={<User size={16} />}
              label="Name"
              value={billingDetails.name}
            />
            <InfoRow
              icon={<Home size={16} />}
              label="Address"
              value={billingDetails.address}
            />
            <InfoRow
              icon={<Mail size={16} />}
              label="Email"
              value={billingDetails.email}
            />
            <InfoRow
              icon={<Phone size={16} />}
              label="Phone"
              value={billingDetails.phone}
            />
          </div>
        </motion.div>

        {/* Receipt Details */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-xl border border-gray-100 p-6 bg-gradient-to-br from-white to-gray-50"
        >
          <div className="flex items-center gap-3 mb-5">
            <CreditCard className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-700">
              Receipt Details
            </h3>
          </div>
          <div className="space-y-4">
            <InfoRow label="Tax Type" value={receiptDetails.taxType} />
            <InfoRow label="Period" value={receiptDetails.period} />
            <InfoRow label="Amount" value={receiptDetails.amount} highlight />
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
        </motion.div>
      </div>
    </motion.div>
  )
}

function InfoRow({ label, value, icon, highlight = false }) {
  return (
    <div className="flex gap-3">
      {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div
          className={`text-sm ${
            highlight ? "font-bold text-green-600" : "font-medium text-gray-700"
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  )
}
