import { useNavigate } from "react-router-dom"

import ButtonOne from "../ui/ButtonOne"
import HeroImage from "../assets/hero.png"
export default function Main() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/login")
  }

  return (
    <div className=" min-h-screen flex gap-4 pt-32 mx-28 heroCover" id="home">
      <div className="w-1/2 h-full">
        <p className="text-sm py-2 uppercase text-blue-900">
          Online payment system
        </p>
        <h2 className="font-semibold text-6xl capitalize py-2">
          Tax Filling and <br />
          Payment Online <br />
          Service
        </h2>

        <p className="font-Lato text-gray-800 py-5 pr-16">
          Effortless & Secure Tax Payments – File, Pay, and Stay Compliant with
          Ease! Simplify your tax filing process with real-time tracking,
          automated reminders, and expert support. <br /> <br /> Whether you're
          an individual or a business, we make tax payments stress-free and
          hassle-free!"
        </p>
        <span onClick={handleClick}>
          <ButtonOne />
        </span>
      </div>
    </div>
  )
}
