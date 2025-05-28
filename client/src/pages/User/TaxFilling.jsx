import { useEffect, useState } from "react"
import {
  FiInfo,
  FiCheckCircle,
  FiUpload,
  FiCalendar,
  FiTag,
  FiFileText,
  FiDollarSign,
} from "react-icons/fi"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import {
  format,
  startOfMonth,
  addMonths,
  addYears,
  parseISO,
  getMonth,
} from "date-fns"
import toast from "react-hot-toast"
import { createTaxFiling } from "@/services/Tax"
import { fetchFiledTaxSchedules } from "@/redux/slice/taxschedule"
import { readFileAsDataURL } from "@/helpers/util"

const getFrequency = (category) => {
  if (category === "vat" || category === "personal") return "monthly"
  if (category === "property") return "yearly"
  if (category === "business") return "quarterly"
  return null
}

const generatePeriods = (category, filedSchedules) => {
  const frequency = getFrequency(category)
  const year = new Date().getFullYear()

  // Convert all filled start dates to 'YYYY-MM' format for comparison
  const filled = filedSchedules
    .filter((s) => s.taxCategory === category)
    .map((s) => format(parseISO(s.periodStart), "yyyy-MM"))

  let periods = []

  if (frequency === "monthly") {
    for (let m = 0; m < 12; m++) {
      const date = startOfMonth(new Date(year, m))
      const key = format(date, "yyyy-MM")
      if (!filled.includes(key)) {
        periods.push({ label: format(date, "MMMM yyyy"), value: key })
      }
    }
  }

  if (frequency === "quarterly") {
    for (let q = 0; q < 4; q++) {
      const month = q * 3
      const date = startOfMonth(new Date(year, month))
      const key = format(date, "yyyy-MM")
      if (!filled.includes(key)) {
        periods.push({ label: `Q${q + 1} ${year}`, value: key })
      }
    }
  }

  if (frequency === "yearly") {
    const date = new Date(year, 0, 1)
    const key = format(date, "yyyy-MM")
    if (!filled.includes(key)) {
      periods.push({ label: `${year}`, value: key })
    }
  }

  return periods
}

export default function TaxFilling() {
  const { user } = useSelector((store) => store.user)

  const { filedPeriods: filings } = useSelector((store) => store.filled)

  const [taxPeriod, setTaxPeriod] = useState("")
  const [taxCategory, setTaxCategory] = useState("")
  const [paymentPurpose, setPaymentPurpose] = useState("")
  const [referenceNumber, setReferenceNumber] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState("")
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !filePreview) {
      toast.error("Document file is needed")
      return
    }

    if (taxCategory !== "personal" && referenceNumber < 0) {
      toast.error("Amount can not be negative")
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()

    formData.append("taxCategory", taxCategory)
    formData.append("filingPeriod", taxPeriod)
    formData.append("totalAmount", referenceNumber)
    formData.append("paymentPurpose", paymentPurpose)
    formData.append("notes", additionalNotes)

    // Conditionally append file only if selected
    if (filePreview && file) {
      formData.append("documentFiled", file)
    }

    try {
      const res = await createTaxFiling(formData)

      if (res.success) {
        toast.success(res.message)

        setTaxCategory("")
        setTaxPeriod("")
        setReferenceNumber("")
        setPaymentPurpose("")
        setFile("")
        setAdditionalNotes("")
        setFile("")
        setFilePreview("")

        dispatch(fetchFiledTaxSchedules())
      } else {
        toast.error(res.error)
      }
    } catch (err) {
      toast.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const dataUrl = await readFileAsDataURL(file)
      setFilePreview(dataUrl)
    }
  }

  const periods = generatePeriods(taxCategory, filings)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <section className=" mb-8">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Tax Filing
            </h2>
            <p className="text-gray-500 mt-1">
              Complete your tax payment details
            </p>
          </motion.div>
          <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
            <FiCheckCircle className="text-emerald-500" />
            <span className="text-sm font-medium">Step 1 of 3</span>
          </div>
        </div>
      </section>

      <motion.form
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        onSubmit={handleSubmit}
        className=" mx-auto bg-white rounded-xl overflow-hidden"
      >
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-800">
              Payment Information
            </h3>
            <p className="text-sm text-gray-500">
              Fill in the required details for your tax payment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tax Category */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FiTag className="mr-2 text-gray-400" />
                Tax Category
              </label>
              <select
                value={taxCategory}
                onChange={(e) => setTaxCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              >
                <option value="">Select Category</option>
                {user?.taxCategories.map((data, dataIndex) => (
                  <option value={data} key={dataIndex} className="capitalize">
                    {data === "business" ? "TOT" : data}
                  </option>
                ))}
              </select>
            </div>

            {/* Tax Period */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FiCalendar className="mr-2 text-gray-400" />
                Tax Period
              </label>
              <select
                value={taxPeriod}
                onChange={(e) => setTaxPeriod(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 disabled:bg-gray-300 disabled:cursor-not-allowed focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
                disabled={taxCategory ? false : true}
              >
                <option value="">Select Period</option>
                {periods.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
            {/* Payment Purpose */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FiDollarSign className="mr-2 text-gray-400" />
                Payment Purpose
              </label>
              <select
                value={paymentPurpose}
                onChange={(e) => setPaymentPurpose(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              >
                <option value="">Select Purpose</option>
                <option value="Regular Filing">Regular Filing</option>
                <option value="Penalty Payment">Late Filing Penalty</option>
              </select>
            </div>

            {/* Total amount */}
            {taxCategory === "personal" ? null : (
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FiFileText className="mr-2 text-gray-400" />
                  Total amount
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter total birr for the period"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiUpload className="mr-2 text-gray-400" />
              Supporting Document (optional)
            </label>
            <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
              <div className="flex flex-col items-center justify-center">
                <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">
                  {file ? file.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, JPG, or PNG (max. 5MB)
                </p>
              </div>
              {filePreview && (
                <motion.div
                  className="flex items-center justify-center w-full h-64 overflow-hidden rounded-md"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <img
                    src={filePreview}
                    alt="preview_img"
                    className="object-contain w-full h-full"
                  />
                </motion.div>
              )}
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </label>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FiInfo className="mr-2 text-gray-400" />
              Additional Notes
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Add any notes or explanations (optional)"
              rows="4"
              maxLength="500"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Max 500 characters</span>
              <span>{additionalNotes.length}/500</span>
            </div>
          </div>

          {/* Summary */}
          {(taxPeriod || taxCategory || paymentPurpose) && (
            <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100 space-y-2 animate-fadeIn">
              <h3 className="text-sm font-semibold text-emerald-700">
                Summary Preview:
              </h3>
              {taxPeriod && (
                <p className="text-sm text-gray-700">
                  • Tax Period: {taxPeriod}
                </p>
              )}
              {taxCategory && (
                <p className="text-sm text-gray-700">
                  • Tax Category: {taxCategory}
                </p>
              )}
              {paymentPurpose && (
                <p className="text-sm text-gray-700">
                  • Purpose: {paymentPurpose}
                </p>
              )}
              {referenceNumber && (
                <p className="text-sm text-gray-700">
                  • Reference #: {referenceNumber}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting || !taxPeriod || !taxCategory || !paymentPurpose
            }
            className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${
              isSubmitting || !taxPeriod || !taxCategory || !paymentPurpose
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isSubmitting ? "Processing..." : "Continue to Filing"}
          </button>
        </div>
      </motion.form>
    </div>
  )
}
