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
  Loader2,
  LucideMail,
  Map,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react"

import { validateEmail, validatePhoneNumber } from "@/helpers/Validiation"
import { registerUser } from "@/services/apiUser"
import register from "../assets/register.png"
import toast from "react-hot-toast"
import { HiIdentification, HiKey, HiLockClosed, HiUser } from "react-icons/hi"

export default function Register() {
  const navigate = useNavigate()
  const navigation = useNavigation()
  const actionData = useActionData()
  const isSubmitting = navigation.state === "submitting"

  const handleBack = () => {
    navigate(-1)
  }

  console.log(actionData)

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <section className="w-1/2 h-full pt-5 pl-20">
        <FaAngleLeft
          size={20}
          className="w-8 h-8 p-1 border border-gray-300 rounded-full mb-4 cursor-pointer"
          onClick={handleBack}
        />
        <h2 className="font-bold text-3xl bg-gradient-to-r from-blue-500 to-[#065b8c] text-transparent bg-clip-text">
          Create your account
        </h2>

        {actionData?.status === "error" && (
          <p className="text-white bg-red-300 py-4 my-1 rounded-md px-4">
            {actionData?.data?.errors?.at(0)?.msg || actionData?.data?.message}
          </p>
        )}

        <Form method="POST">
          <div className="w-full h-14 flex gap-4 items-center  my-4">
            <FormCell
              placeholder="Enter your full name"
              name="Full Name"
              type="text"
              width="1/2"
              icon={<HiUser size={20} className="text-gray-700" />}
            />
            <FormCell
              placeholder="Enter your email"
              name="Email"
              type="email"
              width="1/2"
              icon={<LucideMail size={20} className="text-gray-700" />}
            />
          </div>
          <div className="w-full h-14 flex flex-col my-">
            <label htmlFor="sex" className="text-[15px]">
              Sex
            </label>
            <select
              id="sex"
              name="sex"
              className="border border-gray-300 py-2 px-3 rounded-md outline-none focus:border-blue-500 text-[15px]"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="w-full h-14 flex gap-4 items-center   my-4">
            <FormCell
              placeholder="Enter mobile phone"
              name="Mobile Phone"
              type="tel"
              width="1/2"
              icon={<Phone size={20} className="text-gray-700" />}
            />
            <FormCell
              placeholder="Enter your residency"
              name="Residency Place"
              type="text"
              width="1/2"
              icon={<Home size={20} className="text-gray-700" />}
            />
          </div>
          <div className="w-full h-14 flex gap-4 items-center   my-4">
            <FormCell
              placeholder="Enter your woreda"
              name="Woreda"
              type="tel"
              width="1/2"
              icon={<MapPin size={20} className="text-gray-700" />}
            />
            <FormCell
              placeholder="Enter your kebele"
              name="Kebele"
              type="text"
              width="1/2"
              icon={<Map size={20} className="text-gray-700" />}
            />
          </div>
          <FormCell
            placeholder="Enter your tax id"
            name="Tax ID"
            type="text"
            width="full"
            icon={<HiIdentification size={20} className="text-gray-700" />}
          />
          <div className="w-full h-14 flex gap-4 items-center   my-4">
            <FormCell
              placeholder="Enter your password"
              name="Password"
              type="password"
              width="1/2"
              icon={<HiLockClosed size={20} className="text-gray-700" />}
            />
            <FormCell
              placeholder="Confirm your password"
              name="Confirm password"
              type="password"
              width="1/2"
              icon={<ShieldCheck size={20} className="text-gray-700" />}
            />
          </div>
          <div className="w-full h-14 flex gap-4 items-center justify-between my-2">
            <button
              className="border border-gray-300 py-1 px-14 rounded-md cursor-pointer hover:bg-stone-200"
              type="reset"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border border-gray-300 py-2 text-[15px] hover:bg-blue-800 px-14 rounded-md cursor-pointer bg-blue-900 text-white"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader className="animate-spin" size={20} /> Loading...
                </span>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </Form>
      </section>
      <section className="w-1/2 h-full  flex items-center justify-center relative">
        <img src={register} alt="" className="w-[80%] h-[95%] rounded-4xl" />
      </section>
    </div>
  )
}
const FormCell = ({
  name,
  type,
  width,
  placeholder,
  value,
  method_red,
  icon,
}) => {
  return (
    <div className={`w-${width} h-14 flex flex-col`}>
      <label htmlFor={name} className="pb-1 text-gray-800 text-[15px]">
        {name}
      </label>
      <section className="border border-gray-300 rounded-md flex items-center gap-2 px-2">
        {icon || <HiUser size={20} />}
        <input
          value={value}
          type={type}
          name={name}
          placeholder={placeholder}
          onChange={method_red}
          required
          className=" text-[15px]  py-1 px-3 rounded-md outline-none bg-transparent"
        />
      </section>
    </div>
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
    !correctedData.residentialAddress ||
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
