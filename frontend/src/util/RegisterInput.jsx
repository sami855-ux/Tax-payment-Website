import { useNavigate } from "react-router-dom"

export default function RegisterInput() {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate(-1)
  }
  return (
    <div className="w-[95%] h-fit flex flex-col pt-5 pr-14">
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
        <label for="sex" className="text-[15px]">
          Sex
        </label>
        <select
          id="sex"
          name="sex"
          className="border border-gray-300 py-2 px-3 rounded-md outline-none focus:border-blue-500 text-[15px]"
        >
          <option value="">-- Select --</option>
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
        <button
          className="border border-gray-300 py-1 px-14 rounded-md cursor-pointer"
          onClick={handleBack}
        >
          Cancel
        </button>
        <button className="border border-gray-300 py-1 hover:bg-blue-800 px-14 rounded-md cursor-pointer bg-blue-900 text-white">
          Submit
        </button>
      </div>
    </div>
  )
}

const FormCell = ({ name, type, width, placeholder }) => {
  return (
    <div className={`w-${width} h-14 flex flex-col`}>
      <label htmlFor={name} className="pb-1 text-gray-800 text-[15px]">
        {name}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        className="border text-[15px] border-gray-300 py-1 px-3 rounded-md outline-none focus:border-blue-500"
      />
    </div>
  )
}
