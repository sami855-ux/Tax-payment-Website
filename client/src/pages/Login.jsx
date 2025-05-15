import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom"
import { Loader, Eye, EyeOff, Check, X } from "lucide-react"
import { useState } from "react"
import { loginUser } from "@/services/apiUser"
import styles from "./Login.module.css"
import { validateEmail } from "@/helpers/Validiation"
import toast from "react-hot-toast"

export default function Login() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const formError = useActionData()
  const isSubmitting = navigation.state === "submitting"
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")

  const handleRegister = () => {
    navigate("/register")
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
      className="w-screen h-screen flex items-center justify-center bg-gray-900"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxkZWZzPgogICAgPHBhdHRlcm4gaWQ9InBhdHRlcm4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCI+CiAgICAgIDxwYXRoIGQ9Ik0wIDBoNDB2NDBINHoiIGZpbGw9IiMxYzFmMjEiIG9wYWNpdHk9IjAuMSIvPgogICAgICA8cGF0aCBkPSJNNDAgNDBoNDB2NDBINHoiIGZpbGw9IiMxYzFmMjEiIG9wYWNpdHk9IjAuMSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIgb3BhY2l0eT0iMC4yIiB0cmFuc2Zvcm09InJvdGF0ZSg0NSkiLz4KPC9zdmc+')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-indigo-900/80"></div>

      <Form
        className="relative z-10 w-full max-w-lg mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
        method="POST"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">
              Secure access to your tax portal account
            </p>
          </div>

          {formError?.error && (
            <div className="mb-6 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-sm flex items-center">
                <X className="mr-2" size={16} />
                {formError.error}
              </p>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                type="text"
                name="email"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
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
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="••••••••"
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

            {/* Password Strength Meter */}
            {password && (
              <div className="mt-3 space-y-2">
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
                  Password Strength: {strengthText[passwordStrength]}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={() => navigate("/reset")}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={handleRegister}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Create account
            </button>
          </div>
        </div>

        {/* Footer with security message */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500 flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-1 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            Your information is securely encrypted
          </p>
        </div>
      </Form>
    </div>
  )
}

//eslint-disable-next-line
export async function action({ request }) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  let error = ""

  if (!data.email || !data.password) {
    error = "Filed are empty"
  } else if (!validateEmail(data.email)) error = "Invalid email"

  console.log(data)
  if (error) {
    return { error } // return errors if validation fails
  }

  try {
    const response = await loginUser(data)

    if (response.success) {
      toast.success("User Login successfully!")
      //Store the user id in the local storage
      localStorage.setItem("userId", response.user?._id)

      console.log(response.user.role)
      //Redirect dynamically taxpayer
      if (response.user?.role == "taxpayer") return redirect("/user/dashboard")
      else if (response.user?.role == "official")
        return redirect("/official/dashboard")
      else if (response.user?.role == "admin")
        return redirect("/admin/dashboard")
      else return redirect("/login")
    } else {
      console.log(response.error)
      toast.error(response.error.message)
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
