import { Form, useNavigate } from "react-router-dom"
import { FaAngleLeft } from "react-icons/fa"

import register from "../assets/register.png"

export default function Register() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }

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

        <Form method="POST">
          <div className="w-full h-14 flex gap-4 items-center  my-4">
            <FormCell
              placeholder="Enter your full name"
              name="Full Name"
              type="text"
              width="1/2"
            />
            <FormCell
              placeholder="Enter your email"
              name="Email"
              type="email"
              width="1/2"
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
            />
            <FormCell
              placeholder="Enter your residency"
              name="Residency Place"
              type="text"
              width="1/2"
            />
          </div>
          <div className="w-full h-14 flex gap-4 items-center   my-4">
            <FormCell
              placeholder="Enter your woreda"
              name="Woreda"
              type="tel"
              width="1/2"
            />
            <FormCell
              placeholder="Enter your kebele"
              name="Kebele"
              type="text"
              width="1/2"
            />
          </div>
          <FormCell
            placeholder="Enter your tax id"
            name="Tax ID"
            type="text"
            width="full"
          />
          <div className="w-full h-14 flex gap-4 items-center   my-4">
            <FormCell
              placeholder="Enter your password"
              name="Password"
              type="password"
              width="1/2"
            />
            <FormCell
              placeholder="Confirm your password"
              name="Confirm password"
              type="password"
              width="1/2"
            />
          </div>
          <div className="w-full h-14 flex gap-4 items-center justify-between my-2">
            <button className="border border-gray-300 py-1 px-14 rounded-md cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              className="border border-gray-300 py-1 hover:bg-blue-800 px-14 rounded-md cursor-pointer bg-blue-900 text-white"
            >
              Submit
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
const FormCell = ({ name, type, width, placeholder, value, method_red }) => {
  return (
    <div className={`w-${width} h-14 flex flex-col`}>
      <label htmlFor={name} className="pb-1 text-gray-800 text-[15px]">
        {name}
      </label>
      <input
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={method_red}
        className="border text-[15px] border-gray-300 py-1 px-3 rounded-md outline-none focus:border-blue-500"
      />
    </div>
  )
}

//eslint-disable-next-line
export async function action({ request }) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const correctedData = {
    fullName: data["Full Name"],
    gender: data.sex,
    phoneNumber: parseInt(data["Mobile Phone"]),
    taxId: data["Tax ID"],
    password: data.Password,
    email: data.Email,
    residentialAddress: data["Residency Place"],
    kebele: data.Kebele,
    wereda: data.Woreda,
  }
  //Validation

  console.log(correctedData)
  return null
}
