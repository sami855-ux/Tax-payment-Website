import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import BillingReceiptPreview from "./BillingView"
import { cn, readFileAsDataURL } from "@/helpers/util"
import Modal from "@/ui/Modal"
import { createPayment, getApprovedTaxFilingsForUser } from "@/services/Tax"
import toast from "react-hot-toast"
import { Wallet } from "lucide-react"
import { validatePhoneNumber } from "@/helpers/Validiation"
import { FiUpload } from "react-icons/fi"

const buildTaxTypesFromSchedules = (schedules) => {
  const uniqueCategories = new Set()
  const taxTypes = []

  schedules.forEach((schedule) => {
    if (!uniqueCategories.has(schedule.taxCategory)) {
      uniqueCategories.add(schedule.taxCategory)

      taxTypes.push({
        id: schedule.taxCategory,
        name: schedule.taxCategory,
        description: schedule.taxCategory,
      })
    }
  })

  return taxTypes
}

const paymentOptions = [
  {
    id: "telebirr",
    title: "Telebirr",
    description: "Pay securely with your telebirr.",
  },
  {
    id: "bankTransfer",
    title: "Bank Transfer",
    description: "Pay directly from your bank account.",
  },

  {
    id: "mobilePayment",
    title: "Mobile Payment",
    description: "Use Apple Pay, Google Pay, or another wallet.",
  },
]

const banks = [
  "Abisinya",
  "Commercial Bank of Ethiopia",
  "Awash International Bank",
  "Dashen Bank",
  "Bank of Abyssinia",
  "United Bank",
  "Lion International Bank",
  "Nib International Bank",
]

export default function PayTax() {
  const [approved, setApproved] = useState([])

  const taxTypes = buildTaxTypesFromSchedules(approved || [])

  const [selected, setSelected] = useState("full")
  const [partialAmount, setPartialAmount] = useState("")
  const [selectedTax, setSelectedTax] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState("telebirr")
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [filePhoto, setFilePhoto] = useState(null)
  const [filePreview, setFilePreview] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankNumber, setBankNumber] = useState(0)
  const [senderName, setSenderName] = useState("")
  const [isLoading, setIsLoading] = useState("")

  const handleApproved = async () => {
    const res = await getApprovedTaxFilingsForUser()

    if (res.success) {
      setApproved(res.filings)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!filePhoto) {
      toast.error("Recept image is needed")
      return
    }

    const tax = approved?.filter((data) => data.taxCategory === selectedTax)[0]

    const formData = new FormData()
    formData.append("taxFilingId", tax._id)
    formData.append("amount", tax.calculatedTax)
    formData.append("paymentType", selected)
    formData.append(
      "method",
      selectedPayment === "bankTransfer" ? "Bank Transfer" : selectedPayment
    )
    formData.append("bankName", bankName)
    formData.append("senderName", senderName)
    formData.append("bankNumber", bankNumber)
    formData.append("dueDate", tax.dueDate)

    if (selectedPayment === "bankTransfer") {
      if (!bankName || !bankNumber) {
        toast.error("Some filed are not filled")
        return
      }
    }

    // file object
    if (selected === "partial") {
      formData.append("payAmount", parseFloat(partialAmount))
    }

    if (selectedPayment !== "bankTransfer")
      if (!validatePhoneNumber(phoneNumber) || !phoneNumber) {
        toast.error("Phone number is not correct")
        return
      }

    formData.append("phoneNumber", phoneNumber)
    formData.append("paymentReceiptImage", filePhoto)

    try {
      const res = await createPayment(formData)

      if (res.success) {
        handleApproved()

        toast.success(res.message)

        setFilePhoto(null)
        setPartialAmount("")
        setBankName("")
        setBankNumber("")
        setPhoneNumber()
        setFilePreview("")
        setSelectedPayment("telebirr")
        setSelected("full")
        setIsOpen(false)
      } else {
        toast.error(res.error)
      }
    } catch (error) {
      toast.error(error)
    }
  }
  console.log(approved)

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFilePhoto(file)
      const dataUrl = await readFileAsDataURL(file)
      setFilePreview(dataUrl)
    }
  }

  useEffect(() => {
    handleApproved()
  }, [])

  console.log(approved)
  return (
    <>
      <div className="bg-white min-h-screen p-6">
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full min-h-14  pr-5 py-3"
        >
          <h2 className="font-semibold text-3xl text-gray-800 pb-2">Pay tax</h2>
          <p className="text-gray-700">
            Set up your account and get ready to pay taxes.
          </p>
        </motion.section>

        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="tax-pay-page py-6 flex flex-col gap-6"
        >
          {/* 1. Payment Summary Overview */}
          <section className="w-[90%] min-h-fit bg-white rounded-xl p-6 mb-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Payment Summary
              </h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                Pending Payment
              </span>
            </div>

            <div className="w-full min-h-fit flex flex-col lg:flex-row gap-8">
              {/* Payment Overview Card */}
              <div className="w-full lg:w-[35%] bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
                <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-4">
                  Payment Overview
                </h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Outstanding Amount
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {approved && approved?.length > 0
                        ? approved
                            ?.reduce(
                              (total, item) => total + item.calculatedTax,
                              0
                            )
                            .toLocaleString()
                        : "0"}{" "}
                      birr
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Due Date</p>
                      <p className="font-medium text-gray-800">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Breakdown Section */}
              <div className="w-full lg:w-[65%]">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Tax Breakdown
                </h3>

                {approved && approved?.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {approved?.map((data) => {
                      const filingDate = new Date(data.filingDate)
                      const dueDate = new Date(
                        filingDate.setMonth(filingDate.getMonth() + 1)
                      )

                      return (
                        <div
                          key={data._id}
                          className="py-4 flex justify-between items-center"
                        >
                          <div>
                            <p className="font-medium text-gray-800 capitalize">
                              {data.taxCategory === "business"
                                ? "TOT"
                                : data.taxCategory}
                            </p>
                            <p className="text-sm text-gray-500">
                              Due{" "}
                              {dueDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          <p className="font-semibold text-blue-600">
                            {data.calculatedTax.toLocaleString()} birr
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 14h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-2 text-gray-500">
                      No approved filings available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
          {/* 2. Select Tax Type to Pay */}
          {taxTypes && taxTypes.length > 0 ? (
            <motion.section
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                    />
                  </svg>
                  Select Tax Type
                </h2>
                <p className="text-gray-500 text-sm">
                  Choose the tax category you want to file
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {taxTypes?.map((tax) => (
                  <motion.div
                    key={tax.id}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTax(tax?.id)}
                    className={`cursor-pointer border-2 rounded-lg p-5 transition-all duration-200 flex flex-col
          ${
            selectedTax === tax.id
              ? "border-blue-500 bg-blue-50 shadow-md"
              : "border-gray-200 hover:border-blue-300 bg-white"
          }`}
                  >
                    <div className="flex items-start mb-2">
                      <div
                        className={`flex-shrink-0 mt-1 mr-3 p-1 rounded-md ${
                          selectedTax === tax.id
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 capitalize">
                          {tax.name === "business" ? "TOT" : tax.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {tax.description}
                        </p>
                      </div>
                    </div>
                    {selectedTax === tax.id && (
                      <div className="mt-auto pt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Selected
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ) : null}

          {/* 3. Payment Options */}
          <section className="payment-options bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Payment Method
              </h2>
              <p className="text-gray-500 text-sm">
                Choose your preferred payment option
              </p>
            </div>

            <div className="space-y-3">
              {/* Full Payment */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selected === "full"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelected("full")}
              >
                <div className="flex items-start">
                  <div
                    className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                      selected === "full"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selected === "full" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Full Payment
                    </h3>
                    <p className="text-sm text-gray-500">
                      Pay the total amount now
                    </p>
                  </div>
                </div>
              </div>

              {/* Partial Payment */}
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selected === "partial"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => setSelected("partial")}
              >
                <div className="flex items-start">
                  <div
                    className={`mt-1 mr-3 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                      selected === "partial"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selected === "partial" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Partial Payment
                        </h3>
                        <p className="text-sm text-gray-500">
                          Pay part of the total amount
                        </p>
                      </div>
                      {selected === "partial" && (
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Enter amount
                        </div>
                      )}
                    </div>
                    {selected === "partial" && (
                      <div className="mt-3 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">birr</span>
                        </div>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={partialAmount}
                          onChange={(e) => setPartialAmount(e.target.value)}
                          className="block w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Payment Methods */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Wallet className="w-6 h-6 text-indigo-600" />
              </motion.div>
              <motion.h2
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                Payment Method
              </motion.h2>
            </div>

            <motion.div
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {paymentOptions.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ y: -5, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <OptionCardPayment
                    option={option}
                    selected={selectedPayment}
                    onSelect={() => setSelectedPayment(option.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Animated divider */}
            <motion.div
              className="mt-8 mb-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </motion.section>

          {/* 5. Billing/Receipt Preview */}
          <section>
            <BillingReceiptPreview />
          </section>

          {/* Confirm Payment Button */}
          <div className="confirm-payment mt-6 flex justify-center">
            <button
              disabled={!selectedTax}
              className="btn-primary disabled:bg-blue-400 disabled:cursor-not-allowed px-[78px] cursor-pointer py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setIsOpen(true)
              }}
            >
              Confirm & Pay
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={"Add your payment status"}
          description={
            "It typically requires the user to interact with it before continuing with the underlying content."
          }
          modalClassName="w-[50vw] h-fit"
        >
          {selectedPayment === "bankTransfer" && (
            <form className="space-y-4 p-4">
              <div>
                <label
                  htmlFor="bank"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Bank:
                </label>
                <select
                  id="bank"
                  name="bank"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="mt-2 w-full p-2 border border-gray-300 focus:border-gray-400 outline-none rounded-md"
                >
                  <option value="">Select a Bank</option>
                  {banks.map((bank, index) => (
                    <option key={index} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="bankName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Number
                </label>
                <input
                  type="text"
                  id="bankNumber"
                  name="bankNumber"
                  value={bankNumber}
                  onChange={(e) => setBankNumber(e.target.value)}
                  className="mt-2 w-full p-2 border border-gray-300 focus:border-gray-400 outline-none rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="senderName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sender Name
                </label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="mt-2 w-full p-2 border border-gray-300 focus:border-gray-400 outline-none rounded-md"
                  required
                />
              </div>
              <div>
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {filePhoto
                        ? filePhoto.name
                        : "Click to upload or drag and drop"}
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
              <button
                type="submit"
                onClick={handlePayment}
                className="mt-9 w-48 mx-auto p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Submit Payment
              </button>
            </form>
          )}

          {selectedPayment === "telebirr" && (
            <form className="space-y-4 py-4 px-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 w-full p-2 border border-gray-300 focus:border-gray-400 outline-none rounded-md"
                  required
                />
              </div>
              <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {filePhoto
                      ? filePhoto.name
                      : "Click to upload or drag and drop"}
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
              <button
                type="submit"
                onClick={handlePayment}
                className="mt-9 w-48 mx-auto p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Submit Payment
              </button>
            </form>
          )}

          {selectedPayment === "mobilePayment" && (
            <form className="space-y-4 p-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-2 w-full p-2 border border-gray-300 focus:border-gray-400 outline-none rounded-md"
                  required
                />
              </div>
              <div>
                <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-emerald-400 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {filePhoto
                        ? filePhoto.name
                        : "Click to upload or drag and drop"}
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
              <button
                type="submit"
                onClick={handlePayment}
                className="mt-9 w-48 disabled:bg-gray-200 disabled:cursor-not-allowed mx-auto p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
              >
                Submit Payment
              </button>
            </form>
          )}
        </Modal>
      </motion.div>
    </>
  )
}

function OptionCard({ id, title, desc, selected, onClick, children }) {
  const isActive = selected === id

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "cursor-pointer w-[90%] border rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md",
        isActive
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
          : "border-gray-300 bg-gray-200"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          <input
            type="radio"
            checked={isActive}
            onChange={() => {}}
            className="accent-blue-500 scale-125"
          />
        </div>
        <div>
          <div className="text-[16px] font-semibold">{title}</div>
          <div className="text-sm text-gray-500">{desc}</div>
        </div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </motion.div>
  )
}

function OptionCardPayment({ option, selected, onSelect }) {
  const isActive = selected === option.id

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer transition-all duration-300 ease-in-out transform rounded-2xl p-6 border-2 
      ${
        isActive
          ? "border-blue-600 bg-blue-50 shadow-lg scale-105"
          : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
      }`}
    >
      {/* Custom checkbox */}
      <div className="absolute top-4 right-4">
        <span
          className={`w-5 h-5 flex items-center justify-center rounded-full border-2
          ${
            isActive
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-gray-400 bg-white text-transparent"
          }`}
        >
          ✓
        </span>
      </div>

      {/* Card content */}
      <div className="flex flex-col justify-center h-full">
        <h3 className="text-[16px] font-bold text-gray-800 mb-2">
          {option.title}
        </h3>
        <p className="text-gray-600 text-sm">{option.description}</p>
      </div>
    </div>
  )
}
