import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom"
import { FaAngleLeft } from "react-icons/fa"
import {
  Home,
  Loader,
  LucideMail,
  Map,
  MapPin,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react"
import { validateEmail } from "@/helpers/Validiation"
import { registerUser } from "@/services/apiUser"
import toast from "react-hot-toast"
import { HiIdentification, HiLockClosed, HiUser } from "react-icons/hi"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Register() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const actionData = useActionData()
  const isSubmitting = navigation.state === "submitting"
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleBack = () => {
    navigate(-1)
  }

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0
    let strength = 0
    if (pass.length >= 8) strength += 1
    if (/[A-Z]/.test(pass)) strength += 1
    if (/[0-9]/.test(pass)) strength += 1
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1
    return strength
  }

  const passwordStrength = getPasswordStrength(password)
  const strengthText = ["Very Weak", "Weak", "Good", "Strong", "Very Strong"]
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ]

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-gray-900"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CiAgICAgIDxwYXRoIGQ9Ik0wIDBoNDB2NDBINHoiIGZpbGw9IiMxYzFmMjEiIG9wYWNpdHk9IjAuMSIvPgogICAgICA8cGF0aCBkPSJNNDAgNDBoNDB2NDBINHoiIGZpbGw9IiMxYzFmMjEiIG9wYWNpdHk9IjAuMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgb3BhY2l0eT0iMC4yIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSkiLz4KPC9zdmc+')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-indigo-900/80"></div>

      <div className="flex flex-col lg:flex-row h-full w-full relative z-10">
        {/* Left Section - Form */}
        <motion.section
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-white overflow-y-auto none_scroll"
          style={{ height: "100vh" }}
        >
          <div className="max-w-lg mx-auto h-full flex flex-col ">
            <div className="flex items-center mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <FaAngleLeft size={20} className="text-gray-600" />
              </motion.button>
              <h2 className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text ml-4">
                Create your account
              </h2>
            </div>

            {actionData?.status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white bg-red-400 py-3 my-2 rounded-lg px-4 shadow-md flex items-center"
              >
                <X className="mr-2" size={18} />
                {actionData?.data?.errors?.at(0)?.msg ||
                  actionData?.data?.message}
              </motion.div>
            )}

            <Form method="POST" className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1 overflow-y-auto pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    placeholder="Full name"
                    name="Full Name"
                    type="text"
                    icon={<HiUser size={18} className="text-gray-500" />}
                    required
                  />
                  <FormInput
                    placeholder="Email"
                    name="Email"
                    type="email"
                    icon={<LucideMail size={18} className="text-gray-500" />}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="sex"
                    className="text-gray-600 font-medium text-sm"
                  >
                    Gender
                  </label>
                  <select
                    id="sex"
                    name="sex"
                    className="w-full border border-gray-300 py-2 px-4 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <FormInput
                  placeholder="Mobile phone"
                  name="Mobile Phone"
                  type="tel"
                  icon={<Phone size={18} className="text-gray-500" />}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    placeholder="Woreda"
                    name="Woreda"
                    type="text"
                    icon={<MapPin size={18} className="text-gray-500" />}
                    required
                  />
                  <FormInput
                    placeholder="Kebele"
                    name="Kebele"
                    type="text"
                    icon={<Map size={18} className="text-gray-500" />}
                    required
                  />
                </div>

                <FormInput
                  placeholder="TIN number"
                  name="TIN Number"
                  type="text"
                  icon={
                    <HiIdentification size={18} className="text-gray-500" />
                  }
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-600 font-medium text-sm">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiLockClosed size={18} className="text-gray-500" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        )}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-1">
                        <div className="flex gap-1 h-1.5">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`flex-1 rounded-full ${
                                i <= passwordStrength
                                  ? strengthColors[passwordStrength - 1]
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className={`text-xs ${
                            passwordStrength < 2
                              ? "text-red-500"
                              : passwordStrength < 3
                              ? "text-orange-500"
                              : passwordStrength < 4
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}
                        >
                          {strengthText[passwordStrength]}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-600 font-medium text-sm">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ShieldCheck size={18} className="text-gray-500" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                        )}
                      </button>
                    </div>
                    {password && confirmPassword && (
                      <p
                        className={`text-xs ${
                          password === confirmPassword
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {password === confirmPassword ? (
                          <span className="flex items-center">
                            <Check className="h-3 w-3 mr-1" /> Passwords match
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <X className="h-3 w-3 mr-1" /> Passwords don't match
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    Password Requirements:
                  </h4>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li className="flex items-center">
                      {password.length >= 8 ? (
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      Minimum 8 characters
                    </li>
                    <li className="flex items-center">
                      {/[A-Z]/.test(password) ? (
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center">
                      {/[0-9]/.test(password) ? (
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      At least one number
                    </li>
                    <li className="flex items-center">
                      {/[^A-Za-z0-9]/.test(password) ? (
                        <Check className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      At least one special character
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 pb-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="reset"
                  className="px-7 py-1 border cursor-pointer border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-1 bg-gradient-to-r cursor-pointer from-blue-600 to-indigo-600 text-white rounded-md font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-70 text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader className="animate-spin" size={18} />
                      Processing...
                    </span>
                  ) : (
                    "Sign Up"
                  )}
                </motion.button>
              </div>
            </Form>
          </div>
        </motion.section>

        {/* Right Section - Visual (Hidden on mobile) */}
        <section className="hidden lg:flex lg:w-1/2 h-full items-center justify-center p-8">
          <div className="relative h-full w-full flex items-center justify-center">
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 w-full h-full flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center text-white mb-8">
                <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-white" />
                <h3 className="text-2xl font-bold mb-2">Secure Registration</h3>
                <p className="text-white/80">
                  Your information is protected with bank-grade encryption
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <motion.div
                    key={item}
                    className="bg-white/20 rounded-lg p-4 flex flex-col items-center"
                    whileHover={{ y: -5 }}
                  >
                    <div className="h-8 w-8 bg-white/30 rounded-full mb-2"></div>
                    <div className="h-2 w-12 bg-white/30 rounded-full"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

const FormInput = ({ name, type, placeholder, icon, required }) => {
  return (
    <motion.div whileFocus={{ y: -2 }} className="space-y-1">
      <label htmlFor={name} className="text-gray-600 font-medium text-sm">
        {name}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          required={required}
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
        />
      </div>
    </motion.div>
  )
}

//eslint-disable-next-line
export async function action({ request }) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  // Initialize an empty error message
  let error = ""

  // Corrected data object
  const correctedData = {
    fullName: data["Full Name"],
    gender: data.sex,
    phoneNumber: parseInt(data["Mobile Phone"]),
    taxId: data["Tax ID"],
    password: data.Password,
    confirmPassword: data["Confirm password"],
    email: data.Email,
    residentialAddress: data["Residency Place"],
    kebele: data.Kebele,
    wereda: data.Woreda,
  }

  // Validation
  if (
    !correctedData.fullName ||
    !correctedData.gender ||
    !correctedData.phoneNumber ||
    !correctedData.taxId ||
    !correctedData.password ||
    !correctedData.email ||
    !correctedData.kebele ||
    !correctedData.wereda
  ) {
    error = "All fields must be filled out!"
  } else if (!validateEmail(correctedData.email)) {
    error = "Invalid email address!"
  } else if (correctedData.password !== correctedData.confirmPassword) {
    error = "Passwords do not match!"
  }

  if (error) {
    toast.error(error)
    return
  }

  try {
    const response = await registerUser(correctedData)

    if (response.success) {
      toast.success("User registered successfully!")

      //Store the user id in the local storage
      localStorage.setItem("userId", response.user?._id)

      console.log(response.user.role)
      //Redirect dynamically taxpayer
      if (response.user?.role == "taxpayer") return redirect("/user/dashboard")
      else if (response.user?.role == "official")
        return redirect("/official/dashboard")
      else if (response.user?.role == "admin")
        return redirect("/admin/dashboard")
      else return redirect("/register")
    } else {
      console.log(response.error)
      return {
        status: "error",
        data: response.error,
      }
    }
  } catch (error) {
    toast.error("Something went wrong, please try again later.")
    console.error(error)
    return
  }
}
