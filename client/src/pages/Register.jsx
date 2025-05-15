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
} from "lucide-react"
import { validateEmail } from "@/helpers/Validiation"
import { registerUser } from "@/services/apiUser"
import register from "../assets/register.png"
import toast from "react-hot-toast"
import { HiIdentification, HiLockClosed, HiUser } from "react-icons/hi"
import { motion } from "framer-motion"

export default function Register() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const actionData = useActionData()
  const isSubmitting = navigation.state === "submitting"

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex flex-col lg:flex-row h-full w-full">
        {/* Left Section - Form */}
        <motion.section
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 bg-white overflow-y-auto"
          style={{ height: "100vh" }}
        >
          <div className="max-w-lg mx-auto h-full flex flex-col">
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
                className="text-white bg-red-400 py-3 my-2 rounded-lg px-4 shadow-md"
              >
                {actionData?.data?.errors?.at(0)?.msg ||
                  actionData?.data?.message}
              </motion.div>
            )}

            <Form method="POST" className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1 overflow-y-auto pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                  <label htmlFor="sex" className="text-gray-600 font-medium">
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
                    <option value="other">Other</option>
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
                  placeholder="Tax ID"
                  name="Tax ID"
                  type="text"
                  icon={
                    <HiIdentification size={18} className="text-gray-500" />
                  }
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    placeholder="Password"
                    name="Password"
                    type="password"
                    icon={<HiLockClosed size={18} className="text-gray-500" />}
                    required
                  />
                  <FormInput
                    placeholder="Confirm password"
                    name="Confirm password"
                    type="password"
                    icon={<ShieldCheck size={18} className="text-gray-500" />}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 pb-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="reset"
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-70 text-sm sm:text-base"
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

        {/* Right Section - Image (Hidden on mobile) */}
        <section className="hidden lg:flex lg:w-1/2 h-full items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 p-8">
          <div className="relative h-full w-full flex items-center justify-center">
            <motion.img
              src={register}
              alt="Registration illustration"
              className="max-h-full max-w-full object-contain rounded-lg"
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
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
