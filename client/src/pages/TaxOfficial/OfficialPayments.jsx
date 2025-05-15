import React, { useState } from "react"
import { motion } from "framer-motion"
import PaymentTable from "@/components/PaymentTable"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { approvePayment, getPaymentsForOfficial } from "@/services/Tax"
import Spinner from "@/ui/Spinner"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const OfficialPayments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["assigned-payment"],
    queryFn: getPaymentsForOfficial,
  })
  const queryClient = useQueryClient()

  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [action, setAction] = useState("approve")
  const [remarks, setRemarks] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleVerify = (paymentId, isApproved) => {
    const payment = data.find((p) => p.id === paymentId)
    setSelectedPayment(payment)
    setAction(isApproved ? "approve" : "reject")
    setShowModal(true)
    console.log(payment)
    console.log(showModal, action, isApproved)
  }

  const handleView = (payment) => {
    setSelectedPayment(payment)
    setAction("view")
    setShowModal(true)
  }

  const handleSendReminder = (taxpayerId) => {
    console.log("Send reminder to taxpayer:", taxpayerId)
    // Add your reminder logic here
  }

  const submitVerification = async () => {
    if (!selectedPayment) return

    try {
      setIsSubmitting(true)
      const response = await approvePayment({
        paymentId: selectedPayment.id,
        status: action === "approve" ? "Paid" : "Failed",
        remarks,
      })

      if (response.success) {
        toast.success(
          `Payment ${
            action === "approve" ? "approved" : "rejected"
          } successfully`
        )
        queryClient.invalidateQueries(["assigned-payment"])
        setShowModal(false)
      } else {
        toast.error(response.error || "Failed to verify payment")
      }
    } catch (error) {
      toast.error(error.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
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
        <>
          <PaymentTable
            data={data}
            onVerify={handleVerify}
            onView={handleView}
            onSendReminder={handleSendReminder}
          />

          {/* Payment Verification Modal */}
          {showModal && selectedPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-scroll"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {action === "view" ? "Payment Details" : "Verify Payment"}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Taxpayer</p>
                        <p className="font-medium">
                          {selectedPayment.taxpayerName || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">TIN</p>
                        <p className="font-medium">
                          {selectedPayment.taxpayerId || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Tax Category</p>
                        <p className="font-medium">
                          {selectedPayment.taxType || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="font-medium">
                          {selectedPayment.paymentMethod || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-2xl font-bold">
                        {selectedPayment.amount?.toLocaleString() || "N/A"} birr
                      </p>
                    </div>

                    <div className="w-full h-48">
                      <img
                        src={selectedPayment.paymentReceiptImage}
                        alt=""
                        className="w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          selectedPayment.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : selectedPayment.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedPayment.status?.charAt(0).toUpperCase() +
                          selectedPayment.status?.slice(1) || "N/A"}
                      </span>
                    </div>

                    {action !== "view" && (
                      <>
                        <div className="pt-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Verification Action
                          </label>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="verificationAction"
                                value="approve"
                                checked={action === "approve"}
                                onChange={() => setAction("approve")}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span>Approve Payment</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="verificationAction"
                                value="reject"
                                checked={action === "reject"}
                                onChange={() => setAction("reject")}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span>Reject Payment</span>
                            </label>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="remarks"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Remarks
                          </label>
                          <textarea
                            id="remarks"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter verification remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowModal(false)
                        setRemarks("")
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {action === "view" ? "Close" : "Cancel"}
                    </button>

                    {action !== "view" && (
                      <button
                        onClick={submitVerification}
                        disabled={!action || isSubmitting}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                            Processing...
                          </span>
                        ) : (
                          "Submit Verification"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default OfficialPayments
