import { useState } from "react"

export default function TaxFilling() {
  const [taxPeriod, setTaxPeriod] = useState("")
  const [taxCategory, setTaxCategory] = useState("")
  const [paymentPurpose, setPaymentPurpose] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")

  return (
    <div className="bg-gray-300 min-h-screen p-4">
      <section className="w-full h-14 flex items-center justify-between pr-5 py-3">
        <h2 className="font-semibold text-2xl text-gray-800">Tax Filling</h2>
      </section>

      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6 w-full  mx-auto">
        <p className="text-sm text-gray-500">
          Fill in the details for your tax payment.
        </p>

        <div className="space-y-4">
          {/* Tax Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Period
            </label>
            <select
              value={taxPeriod}
              onChange={(e) => setTaxPeriod(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="">Select Period</option>
              <option value="January 2025">January 2025</option>
              <option value="Q1 2025">Q1 2025</option>
              <option value="FY 2024/25">Fiscal Year 2024/25</option>
            </select>
          </div>

          {/* Tax Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Category
            </label>
            <select
              value={taxCategory}
              onChange={(e) => setTaxCategory(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="">Select Category</option>
              <option value="Income Tax">Income Tax</option>
              <option value="VAT">Value Added Tax (VAT)</option>
              <option value="Corporate Tax">Corporate Tax</option>
              <option value="Property Tax">Property Tax</option>
            </select>
          </div>

          {/* Payment Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Purpose
            </label>
            <select
              value={paymentPurpose}
              onChange={(e) => setPaymentPurpose(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
              <option value="">Select Purpose</option>
              <option value="Regular Filing">Regular Filing</option>
              <option value="Penalty Payment">Late Filing Penalty</option>
              <option value="Audit Settlement">Audit Settlement</option>
              <option value="Advance Payment">Advance Tax Payment</option>
            </select>
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number (optional)
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter reference or invoice number"
              className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Add any notes or explanations (optional)"
              rows="4"
              className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {additionalNotes.length}/500 characters
            </div>
          </div>
        </div>

        {/* Summary */}
        {taxPeriod && taxCategory && paymentPurpose && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-inner space-y-2">
            <h3 className="text-sm font-semibold text-blue-700">Summary:</h3>
            <p className="text-sm text-gray-700">• Tax Period: {taxPeriod}</p>
            <p className="text-sm text-gray-700">
              • Tax Category: {taxCategory}
            </p>
            <p className="text-sm text-gray-700">• Purpose: {paymentPurpose}</p>
            {referenceNumber && (
              <p className="text-sm text-gray-700">
                • Ref #: {referenceNumber}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
