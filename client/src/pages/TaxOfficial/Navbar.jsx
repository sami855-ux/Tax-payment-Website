import { AiOutlineCloseCircle } from "react-icons/ai"
import { HiOutlineSearch } from "react-icons/hi"
import { HiBars3CenterLeft } from "react-icons/hi2"
import { IoMdNotificationsOutline } from "react-icons/io"
import { useState } from "react"

import hero from "@/assets/logo.png"
import { FiChevronDown } from "react-icons/fi"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { Bell } from "lucide-react"

export default function Navbar({ onBarClicked }) {
  const { user } = useSelector((store) => store.user)
  const [query, setIsQuery] = useState("")

  return (
    <>
      <div className="w-screen md:w-[calc(100vw-5.5rem)] lg:w-[calc(100vw-18rem)] h-20 bg-stone-100 flex items-center justify-between px-5">
        <section className="h-full w-fit flex items-center gap-4">
          <HiBars3CenterLeft
            size={27}
            className="hover:text-stone-600 cursor-pointer md:hidden"
            onClick={() => {
              onBarClicked()
            }}
          />

          <section className="w-fit h-11 bg-gray-300 rounded-md flex items-center space-x-2 px-3">
            <HiOutlineSearch size={19} className="text-gray-600" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none bg-transparent  hidden md:inline-flex"
              onChange={(e) => {
                setIsQuery(e.target.value)
              }}
              value={query}
            />
            <AiOutlineCloseCircle
              size={19}
              className="cursor-pointer hidden md:inline-flex"
            />
          </section>
        </section>

        <section className="h-full w-fit flex items-center gap-6">
          <Link
            to={"/official/notification"}
            className="relative w-7 h-7 flex items-center justify-center"
          >
            <Bell size={23} className="hover:text-green-700" />
            <span className="absolute w-4 h-4 -top-2 -right-2 rounded-full text-[13px] flex items-center justify-center text-white bg-red-600">
              3
            </span>
          </Link>
          <div className="w-fit h-full flex items-center space-x-2">
            <img
              src={hero}
              alt="Logo"
              className="w-9 h-9 rounded-full cursor-pointer"
            />
            <section className="px-4">
              <h2 className="font-semibold text-gray-800  text-[15px] cursor-pointer hidden md:block">
                {user?.fullName}
              </h2>
              <p className="text-[13px] uppercase font-semibold text-green-600">
                {user?.role}
              </p>
            </section>
            <FiChevronDown size={22} className="cursor-pointer" />
          </div>
        </section>
      </div>
    </>
  )
}
