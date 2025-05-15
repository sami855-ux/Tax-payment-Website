import { useState } from "react"
import { useForm } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  Check,
  Landmark,
  Briefcase,
  Home,
  User,
  FileText,
  DollarSign,
  BadgeInfo,
  Loader2,
} from "lucide-react"
import { completeTaxSetup, getUserById } from "@/services/apiUser"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { login } from "@/redux/slice/userSlice"

const TaxSetupWizard = () => {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm()
  const dispatch = useDispatch()

  const taxCategory = watch("taxCategory")
  const registeredForVAT = watch("registeredForVAT")

  const taxCategories = [
    { value: "personal", label: "Personal Income", icon: <User size={18} /> },
    { value: "business", label: "Business", icon: <Briefcase size={18} /> },
    { value: "vat", label: "VAT", icon: <FileText size={18} /> },
    { value: "property", label: "Property", icon: <Home size={18} /> },
    { value: "other", label: "Other", icon: <Landmark size={18} /> },
  ]

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  const getUserInfo = async () => {
    const res = await getUserById()

    if (res.success) {
      dispatch(
        login({
          user: res.user,
        })
      )
    }
  }

  const onSubmit = async (data) => {
    console.log(data)
    setIsSubmitting(true)
    try {
      const res = await completeTaxSetup(data)

      if (res.success) {
        toast.success(res.message)
        getUserInfo()
      }
    } catch (error) {
      toast.success(error)
    } finally {
      setIsSubmitting(false)
      setStep(1)
    }
  }

  const renderPersonalIncomeFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Employment Type
        </label>
        <select
          {...register("employmentType", { required: "Required" })}
          className="w-full p-3 border border-gray-300 rounded-lg outline-none"
        >
          <option value="">Select</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-employed</option>
        </select>
        {errors.employmentType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.employmentType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <DollarSign size={14} /> Monthly Income
        </label>
        <input
          type="number"
          {...register("monthlyIncome", {
            required: "Required",
            min: { value: 0, message: "Must be positive" },
          })}
          className="w-full p-3 border rounded-lg border-gray-300"
          placeholder="Estimated monthly income"
        />
        {errors.monthlyIncome && (
          <p className="text-red-500 text-sm mt-1">
            {errors.monthlyIncome.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">TIN Number</label>
        <input
          type="text"
          {...register("tinNumber", {
            required: "Required",
            pattern: {
              value: /^[A-Za-z0-9]+$/,
              message: "Invalid TIN format",
            },
          })}
          className="w-full p-3 border rounded-lg border-gray-300"
          placeholder="Taxpayer Identification Number"
        />
        {errors.tinNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.tinNumber.message}
          </p>
        )}
      </div>
    </div>
  )

  const renderBusinessFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Business Type</label>
        <input
          type="text"
          {...register("businessType", { required: "Required" })}
          className="w-full p-3 border border-gray-300 outline-none rounded-lg"
          placeholder="e.g., Retail, Services"
        />
        {errors.businessType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.businessType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Business Name</label>
        <input
          type="text"
          {...register("businessName", { required: "Required" })}
          className="w-full p-3 border rounded-lg border-gray-300 outline-none"
          placeholder="Legal business name"
        />
        {errors.businessName && (
          <p className="text-red-500 text-sm mt-1">
            {errors.businessName.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Business License Number
        </label>
        <input
          type="text"
          {...register("businessLicenseNumber")}
          className="w-full p-3 border rounded-lg border-gray-300 outline-none"
          placeholder="If applicable"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">TIN Number</label>
        <input
          type="text"
          {...register("tinNumber", { required: "Required" })}
          className="w-full p-3 border rounded-lg border-gray-300 outline-none"
          placeholder="Business TIN"
        />
        {errors.tinNumber && (
          <p className="text-red-500 text-sm mt-1">
            {errors.tinNumber.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <DollarSign size={14} /> Annual Revenue Estimate
        </label>
        <input
          type="number"
          {...register("annualRevenueEstimate", { required: "Required" })}
          className="w-full p-3 border rounded-lg border-gray-300 outline-none"
          placeholder="For tax bracket suggestions"
        />
        {errors.annualRevenueEstimate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.annualRevenueEstimate.message}
          </p>
        )}
      </div>
    </div>
  )

  const renderVATFields = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="registeredForVAT"
          {...register("registeredForVAT")}
          className="w-5 h-5 "
        />
        <label htmlFor="registeredForVAT" className="text-sm font-medium">
          Registered for VAT
        </label>
      </div>

      {registeredForVAT && (
        <div>
          <label className="block text-sm font-medium mb-1">
            VAT Registration Number
          </label>
          <input
            type="text"
            {...register("vatRegistrationNumber", {
              required: "Required if registered",
            })}
            className="w-full p-3 border rounded-lg border-gray-300 outline-none"
          />
          {errors.vatRegistrationNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.vatRegistrationNumber.message}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <DollarSign size={14} /> Expected Monthly Sales
        </label>
        <input
          type="number"
          {...register("expectedMonthlySales", { required: "Required" })}
          className="w-full p-3 border rounded-lg border-gray-300 outline-none"
          placeholder="For threshold validation"
        />
        {errors.expectedMonthlySales && (
          <p className="text-red-500 text-sm mt-1">
            {errors.expectedMonthlySales.message}
          </p>
        )}
      </div>
    </div>
  )

  const renderPropertyFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Property Type</label>
        <select
          {...register("propertyType", { required: "Required" })}
          className="w-full p-3 border rounded-lg border-gray-300 outline-none"
        >
          <option value="">Select</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="industrial">Industrial</option>
          <option value="land">Land</option>
        </select>
        {errors.propertyType && (
          <p className="text-red-500 text-sm mt-1">
            {errors.propertyType.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
          <DollarSign size={14} /> Property Value Estimate
        </label>
        <input
          type="number"
          {...register("propertyValueEstimate", { required: "Required" })}
          className="w-full p-3 border rounded-lg border-gray-300 outline-none"
          placeholder="For tax calculation"
        />
        {errors.propertyValueEstimate && (
          <p className="text-red-500 text-sm mt-1">
            {errors.propertyValueEstimate.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Ownership Status
        </label>
        <select
          {...register("ownershipStatus", { required: "Required" })}
          className="w-full p-3 border rounded-lg border-gray-300 outline-none"
        >
          <option value="">Select</option>
          <option value="owner">Owner</option>
          <option value="landlord">Landlord</option>
          <option value="tenant">Tenant</option>
          <option value="joint">Joint Ownership</option>
        </select>
        {errors.ownershipStatus && (
          <p className="text-red-500 text-sm mt-1">
            {errors.ownershipStatus.message}
          </p>
        )}
      </div>
    </div>
  )

  const renderReviewSection = () => {
    const formData = watch()
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-2 flex items-center gap-2">
            {taxCategories.find((c) => c.value === taxCategory)?.icon}
            {taxCategories.find((c) => c.value === taxCategory)?.label}
          </h3>

          {taxCategory === "personal" && (
            <ul className="space-y-2">
              <li>
                <span className="text-gray-600">Employment:</span>{" "}
                {formData.employmentType}
              </li>
              <li>
                <span className="text-gray-600">Monthly Income:</span> $
                {formData.monthlyIncome}
              </li>
              <li>
                <span className="text-gray-600">TIN:</span> {formData.tinNumber}
              </li>
            </ul>
          )}

          {taxCategory === "business" && (
            <ul className="space-y-2">
              <li>
                <span className="text-gray-600">Business Type:</span>{" "}
                {formData.businessType}
              </li>
              <li>
                <span className="text-gray-600">Business Name:</span>{" "}
                {formData.businessName}
              </li>
              <li>
                <span className="text-gray-600">License Number:</span>{" "}
                {formData.businessLicenseNumber || "N/A"}
              </li>
              <li>
                <span className="text-gray-600">TIN:</span> {formData.tinNumber}
              </li>
              <li>
                <span className="text-gray-600">Annual Revenue:</span> $
                {formData.annualRevenueEstimate}
              </li>
            </ul>
          )}

          {taxCategory === "vat" && (
            <ul className="space-y-2">
              <li>
                <span className="text-gray-600">VAT Registered:</span>{" "}
                {formData.registeredForVAT ? "Yes" : "No"}
              </li>
              {formData.registeredForVAT && (
                <li>
                  <span className="text-gray-600">VAT Number:</span>{" "}
                  {formData.vatRegistrationNumber}
                </li>
              )}
              <li>
                <span className="text-gray-600">Monthly Sales:</span> $
                {formData.expectedMonthlySales}
              </li>
            </ul>
          )}

          {taxCategory === "property" && (
            <ul className="space-y-2">
              <li>
                <span className="text-gray-600">Property Type:</span>{" "}
                {formData.propertyType}
              </li>
              <li>
                <span className="text-gray-600">Value Estimate:</span> $
                {formData.propertyValueEstimate}
              </li>
              <li>
                <span className="text-gray-600">Ownership:</span>{" "}
                {formData.ownershipStatus}
              </li>
            </ul>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium mb-2">Terms & Conditions</h3>
          <p className="text-sm text-gray-600">
            By submitting this form, you confirm that the information provided
            is accurate to the best of your knowledge.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[80%] mx-7 p-6 bg-white rounded-xl ">
      {/* Progress Steps */}
      <div className="w-[80%] flex justify-between mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <motion.div
              className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${step >= i ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              whileHover={{ scale: step >= i ? 1.05 : 1 }}
            >
              {step > i ? <Check size={18} /> : i}
            </motion.div>
            <span
              className={`text-sm mt-1 ${
                step >= i ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {i === 1 ? "Category" : i === 2 ? "Details" : "Review"}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step > 1 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step > 1 ? -50 : 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step 1: Category Selection */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <BadgeInfo size={20} /> Select Tax Category
                </h2>
                <div className="space-y-3">
                  {taxCategories.map((category) => (
                    <motion.div
                      key={category.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setValue("taxCategory", category.value)
                          nextStep()
                        }}
                        className={`w-full p-4 rounded-lg border flex items-center gap-3
                          ${
                            taxCategory === category.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                      >
                        {category.icon}
                        <span>{category.label}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Dynamic Form Fields */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  {taxCategories.find((c) => c.value === taxCategory)?.icon}
                  {
                    taxCategories.find((c) => c.value === taxCategory)?.label
                  }{" "}
                  Details
                </h2>

                {taxCategory === "personal" && renderPersonalIncomeFields()}
                {taxCategory === "business" && renderBusinessFields()}
                {taxCategory === "vat" && renderVATFields()}
                {taxCategory === "property" && renderPropertyFields()}
                {taxCategory === "other" && (
                  <div className="text-center py-8 text-gray-500">
                    Please contact our support team for other tax categories.
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Review Your Information
                </h2>
                {renderReviewSection()}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="px-10 py-2 border border-gray-300 cursor-pointer  hover:bg-gray-200 rounded-lg text-gray-700 "
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={step === 1 && !taxCategory}
              className="px-7 cursor-pointer py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 disabled:bg-gray-400"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-7 cursor-pointer py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1 disabled:bg-green-400"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin cursor-not-allowed"
                  />{" "}
                  Submitting...
                </>
              ) : (
                <>
                  Submit <Check size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default TaxSetupWizard
