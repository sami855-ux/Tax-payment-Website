import { useState } from "react"
import { motion } from "framer-motion"

import BillingReceiptPreview from "./BillingView"
import { cn } from "@/helpers/util"
import Modal from "@/ui/Modal"

const taxTypes = [
  {
    id: "income",
    name: "Income Tax",
    description: "Personal or Business earnings",
  },
  {
    id: "business",
    name: "Business Tax",
    description: "Corporate tax filings",
  },
  {
    id: "property",
    name: "Property Tax",
    description: "Land and building taxes",
  },
]

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

export default function PayTax() {
  const [selected, setSelected] = useState("full")
  const [partialAmount, setPartialAmount] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [selectedTax, setSelectedTax] = useState(null)
  const [selectedPayment, setSelectedPayment] = useState("telebirr")
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="bg-gray-300 min-h-screen p-4">
        <section className="w-full h-14 flex items-center justify-between pr-5 py-3">
          <h2 className="font-semibold text-2xl text-gray-800">Pay tax</h2>
        </section>

        <div className="tax-pay-page p-6 flex flex-col gap-6">
          {/* 1. Payment Summary Overview */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-[90%] min-h-fit bg-slate-50 shadow-md rounded-lg p-4 mb-6"
          >
            <h2 className="text-lg text-gray-700 font-semibold mb-4">
              Payment Summary
            </h2>
            <div className="w-full min-h-fit flex flex-col md:flex-row gap-7">
              <section className="w-full md:w-[30%]">
                <p className="text-[15px] my-1">
                  <span className="text-[15px] text-gray-700 pr-4 ">
                    {" "}
                    Outstanding amount:
                  </span>{" "}
                  <span className="font-semibold text-gray-800">
                    2,400 birr
                  </span>
                </p>
                <p className="text-[15px] my-1">
                  <span className="text-[15px] text-gray-700 pr-4 ">
                    {" "}
                    Due date:
                  </span>{" "}
                  <span className="font-semibold text-gray-800">
                    {new Date().toDateString()}
                  </span>
                </p>
                <p className="text-[15px] my-1">
                  <span className="text-[15px] text-gray-700 pr-4 ">
                    {" "}
                    Status
                  </span>{" "}
                  <span className="font-semibold text-gray-800">Pending</span>
                </p>
              </section>

              <section className="w-full md:w-1/2">
                <h3 className="text-[16px] text-gray-800 font-semibold mb-2">
                  Breakdown
                </h3>
                <div className="flex  h-fit gap-3">
                  <section className="w-[40%]">
                    <p className="text-[15px] mb-1">
                      <span className="text-[15px] text-gray-700 pr-4 ">
                        {" "}
                        Principal:
                      </span>{" "}
                      <span className="font-semibold text-gray-800">
                        2,000 birr
                      </span>
                    </p>
                    <p className="text-[15px] mb-1">
                      <span className="text-[15px] text-gray-700 pr-4 ">
                        {" "}
                        Income tax:
                      </span>{" "}
                      <span className="font-semibold text-gray-800">
                        2,000 birr
                      </span>
                    </p>
                  </section>
                  <section className="">
                    <p className="text-[15px] mb-1">
                      <span className="text-[15px] text-gray-700 pr-4 ">
                        {" "}
                        Interest:
                      </span>{" "}
                      <span className="font-semibold text-gray-800">
                        2,000 birr
                      </span>
                    </p>
                    <p className="text-[15px] mb-1">
                      <span className="text-[15px] text-red-600 pr-4 ">
                        {" "}
                        Penalty:
                      </span>{" "}
                      <span className="font-semibold text-gray-800">
                        2,000 birr
                      </span>
                    </p>
                  </section>
                </div>
              </section>
            </div>
            {/* Outstanding Balance, Breakdown, Due Date, Payment Status */}
            {/* Include a table or simple list */}
          </motion.section>

          {/* 2. Payment Options */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="payment-options card"
          >
            <h2 className="text-lg text-gray-700 font-semibold mb-4">
              How would you like to pay
            </h2>
            <div className="space-y-4">
              {/* Full Payment */}
              <OptionCard
                id="full"
                title="Full Payment"
                desc="Pay the total amount now."
                selected={selected}
                onClick={() => setSelected("full")}
              />
              <OptionCard
                id="partial"
                title="Partial Payment"
                desc="Pay part of the total amount."
                selected={selected}
                onClick={() => setSelected("partial")}
              >
                {selected === "partial" && (
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    className="mt-3 w-[50%] py-1 px-4 rounded-lg input input-bordered focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
                  />
                )}
              </OptionCard>

              {/* Scheduled Payment */}
              <OptionCard
                id="scheduled"
                title="Scheduled Payment"
                desc="Set a future payment date."
                selected={selected}
                onClick={() => setSelected("scheduled")}
              >
                {selected === "scheduled" && (
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="mt-3 w-[50%] py-1 px-4 input input-bordered focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
                  />
                )}
              </OptionCard>
            </div>
            {/* Full Amount, Partial Amount input, Scheduled Payment, Installment Plan */}
            {/* Radio buttons or tab switcher */}
          </motion.section>

          {/* 3. Select Tax Type to Pay */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="tax-type-selection card"
          >
            <h2 className="text-lg text-gray-700 font-semibold mb-4">
              Select Tax Type
            </h2>
            <div className="w-[90%] grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {taxTypes.map((tax) => (
                <div
                  key={tax.id}
                  onClick={() => setSelectedTax(tax.id)}
                  className={`cursor-pointer border rounded-xl p-4 transition-all
              ${
                selectedTax === tax.id
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-300"
                  : "border-gray-300 bg-gray-100"
              }
              hover:shadow-md`}
                >
                  <div className="text-[16px] font-semibold">{tax.name}</div>{" "}
                  <div className="text-sm text-gray-500">{tax.description}</div>
                </div>
              ))}
            </div>

            {selectedTax && (
              <div className=" mt-4 text-green-600 font-medium">
                Selected: {taxTypes.find((t) => t.id === selectedTax)?.name}
              </div>
            )}
            {/* Dropdown or list of tax types (with descriptions maybe) */}
          </motion.section>

          {/* 4. Payment Methods */}
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>

            <div className="w-[90%] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {paymentOptions.map((option) => (
                <OptionCardPayment
                  key={option.id}
                  option={option}
                  selected={selectedPayment}
                  onSelect={() => setSelectedPayment(option.id)}
                />
              ))}
            </div>
            {/* Radio buttons for payment methods + dynamic input depending on choice */}
          </motion.section>

          {/* 5. Billing/Receipt Preview */}
          <section>
            <BillingReceiptPreview />
          </section>

          {/* Confirm Payment Button */}
          <div className="confirm-payment mt-6 flex justify-center">
            <button
              className="btn-primary px-[78px] cursor-pointer py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsOpen(true)}
            >
              Confirm & Pay
            </button>
          </div>
        </div>
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
                  htmlFor="bankName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  // value={formData.bankName}
                  // onChange={handleInputChange}
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
                  // value={formData.senderName}
                  // onChange={handleInputChange}
                  className="mt-2 w-full p-2 border border-gray-300 focus:border-gray-400 outline-none rounded-md"
                  required
                />
              </div>
              <div>
                <div className="space-y-2">
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Receipt
                  </label>
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="file"
                      className=" bg-blue-200 text-gray-900 cursor-pointer text-[15px] py-2  px-4 rounded-md hover:bg-blue-300 transition-all"
                    >
                      Select Image
                    </label>
                    <span className="text-gray-500">
                      {/* {formData.file ? formData.file.name : "No file selected"} */}{" "}
                      No file selected
                    </span>
                  </div>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    // onChange={handleFileChange}
                    className="hidden" // Hide the default file input
                  />
                </div>
              </div>
              <button
                type="submit"
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
                  type="tele"
                  id="phoneNumber"
                  name="phoneNumber"
                  // value={formData.phoneNumber}
                  // onChange={handleInputChange}
                  className="mt-2 w-full p-2 border border-gray-300 focus:border-gray-400 outline-none rounded-md"
                  required
                />
              </div>
              <div>
                <div className="space-y-2">
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Receipt
                  </label>
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="file"
                      className=" bg-blue-200 text-gray-900 cursor-pointer text-[15px] py-2  px-4 rounded-md hover:bg-blue-300 transition-all"
                    >
                      Select Image
                    </label>
                    <span className="text-gray-500">
                      {/* {formData.file ? formData.file.name : "No file selected"} */}{" "}
                      No file selected
                    </span>
                  </div>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    // onChange={handleFileChange}
                    className="hidden" // Hide the default file input
                  />
                </div>
              </div>
              <button
                type="submit"
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
                  // value={formData.phoneNumber}
                  // onChange={handleInputChange}
                  className="mt-2 w-full p-2 border border-gray-300 focus:border-gray-400 outline-none rounded-md"
                  required
                />
              </div>
              <div>
                <div className="space-y-2">
                  <label
                    htmlFor="file"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload Receipt
                  </label>
                  <div className="flex items-center space-x-4">
                    <label
                      htmlFor="file"
                      className=" bg-blue-200 text-gray-900 cursor-pointer text-[15px] py-2  px-4 rounded-md hover:bg-blue-300 transition-all"
                    >
                      Select Image
                    </label>
                    <span className="text-gray-500">
                      {/* {formData.file ? formData.file.name : "No file selected"} */}{" "}
                      No file selected
                    </span>
                  </div>
                  <input
                    type="file"
                    id="file"
                    name="file"
                    // onChange={handleFileChange}
                    className="hidden" // Hide the default file input
                  />
                </div>
              </div>
              <button
                type="submit"
                className="mt-9 w-48 mx-auto p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
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
