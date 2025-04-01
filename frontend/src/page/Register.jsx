import { useNavigate } from "react-router-dom"
import { FaAngleLeft } from "react-icons/fa"

import register from "../assets/register.png"
import RegisterInput from "../util/RegisterInput"

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
        <p className="text-gray-500 pt-4 font-light text-[16px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, iste.
        </p>
        <RegisterInput />
      </section>
      <section className="w-1/2 h-full  flex items-center justify-center relative">
        <img src={register} alt="" className="w-[80%] h-[95%] rounded-4xl" />
      </section>
    </div>
  )
}
