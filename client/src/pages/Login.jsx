import {
  Form,
  redirect,
  useActionData,
  useNavigate,
  useNavigation,
} from "react-router-dom"
import { Loader } from "lucide-react"

import { loginUser } from "@/services/apiUser"
import styles from "./Login.module.css"
import { validateEmail } from "@/helpers/Validiation"
import toast from "react-hot-toast"

export default function Login() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const formError = useActionData()
  const isSubmitting = navigation.state === "submitting"

  const handleRegister = () => {
    navigate("/register")
  }

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Form
        className={`${styles["form"]} border border-gray-100 shadow-2xl`}
        method="POST"
      >
        <div className="py-5 ">
          <h2 className="text-2xl font-semibold bg-gradient-to-r py-2 text-center from-blue-500 to-[#065b8c] text-transparent bg-clip-text">
            Hi there, Good to see you back!
          </h2>
          <p className="text-center text-[14px] px-8 text-gray-600">
            Effortless & Secure Tax Payments – File, Pay, and Stay Compliant
            with Ease!
          </p>
        </div>
        {formError?.error && (
          <p className="text-red-500 text-[15px] my-2 py-4 bg-red-100 px-4 rounded-md">
            {formError.error}
          </p>
        )}
        <div className={`${styles["flex-column"]} `}>
          <label className="text-blue-800">Email </label>
        </div>
        <div className={styles["inputForm"]}>
          <svg
            height="20"
            viewBox="0 0 32 32"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Layer_3" data-name="Layer 3">
              <path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z"></path>
            </g>
          </svg>
          <input
            type="text"
            name="email"
            className={styles["input"]}
            placeholder="Enter your Email"
          />
        </div>

        <div className={styles["flex-column"]}>
          <label>Password </label>
        </div>
        <div className={styles["inputForm"]}>
          <svg
            height="20"
            viewBox="-64 0 512 512"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0"></path>
            <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0"></path>
          </svg>
          <input
            type="password"
            name="password"
            className={styles["input"]}
            placeholder="Enter your Password"
          />
          <svg
            viewBox="0 0 576 512"
            height="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"></path>
          </svg>
        </div>

        <div className={styles["flex-row"]}>
          <div>
            <input type={styles["checkbox"]} />
            <label>Remember me </label>
          </div>
          <span className={styles["span"]}>Forgot password?</span>
        </div>
        <button type="submit" className={styles["button-submit"]}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="animate-spin" size={20} /> Please wait...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
        <p className={styles["p"]}>
          Don't have an account?{" "}
          <span className={styles["span"]} onClick={handleRegister}>
            Sign Up
          </span>
        </p>
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
