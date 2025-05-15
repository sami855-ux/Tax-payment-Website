import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { resetPassword } from "@/services/apiUser"
import toast from "react-hot-toast"
import { Shield } from "lucide-react"

export default function Reset() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    trigger,
  } = useForm({
    mode: "onChange",
  })

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    console.log("hi")
    const result = await resetPassword({
      email: data.email,
      phoneNumber: data.phone,
      newPassword: data.newPassword,
    })

    if (result.success) {
      toast.success(result.message)
      reset()
      navigate("/login")
    } else {
      toast.error("Error: " + result.message)
    }
  }

  // Manual validation functions
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(value) || "Please enter a valid email"
  }

  const validatePhone = (value) => {
    return value.length >= 10 || "Phone number must be at least 10 digits"
  }

  const validatePassword = (value) => {
    if (value.length < 8) return "Password must be at least 8 characters"
    if (!/[A-Z]/.test(value))
      return "Must contain at least one uppercase letter"
    if (!/[0-9]/.test(value)) return "Must contain at least one number"
    if (!/[^A-Za-z0-9]/.test(value))
      return "Must contain at least one special character"
    return true
  }

  const validateConfirmPassword = (value) => {
    return value === watch("newPassword") || "Passwords don't match"
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center mt-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* Visual Section */}
        <div className="hidden h-screen md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex-col justify-center items-center">
          <Shield size={20} />
          <div className="text-center text-white">
            <div className="flex justify-center mb-4">
              <Shield size={23} />
            </div>
            <h3 className="text-xl font-bold mb-2">Bank-Grade Security</h3>
            <p className="text-blue-100">
              Your information is protected with 256-bit encryption
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 h-screen">
          <div className="mb-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center md:justify-start">
              <Shield size={23} />
              Reset Your Password
            </h2>
            <p className="text-gray-600 mt-2">
              Create a new secure password to protect your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    validate: validateEmail,
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    validate: validatePhone,
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="+251 ___ ______"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* New Password Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  {...register("newPassword", {
                    required: "Password is required",
                    validate: validatePassword,
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.newPassword ? "border-red-500" : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Create new password"
                />
              </div>
              <PasswordStrengthMeter password={watch("newPassword") || ""} />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: validateConfirmPassword,
                  })}
                  className={`pl-10 w-full px-4 py-3 rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow transition-all ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Securing Account...
                </span>
              ) : (
                "Reset Password Securely"
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Password Strength Meter Component (unchanged)
function PasswordStrengthMeter({ password }) {
  const getStrength = (pass) => {
    if (!pass) return 0

    let strength = 0
    if (pass.length >= 8) strength += 1
    if (/[A-Z]/.test(pass)) strength += 1
    if (/[0-9]/.test(pass)) strength += 1
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1

    return strength
  }

  const strength = getStrength(password)
  const strengthText = ["Very Weak", "Weak", "Good", "Strong", "Very Strong"]
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ]

  return (
    <div className="space-y-1">
      <div className="flex gap-1 h-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${
              i <= strength ? strengthColors[strength - 1] : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {password && (
        <p
          className={`text-xs ${
            strength < 2
              ? "text-red-500"
              : strength < 3
              ? "text-orange-500"
              : strength < 4
              ? "text-blue-500"
              : "text-green-500"
          }`}
        >
          {strengthText[strength]}
        </p>
      )}
    </div>
  )
}

/*

  
*/
