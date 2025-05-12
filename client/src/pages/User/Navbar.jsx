import { AiOutlineCloseCircle } from "react-icons/ai"
import { HiBars3CenterLeft } from "react-icons/hi2"
import { HiOutlineSearch } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Bell } from "lucide-react"
import { useEffect, useState } from "react"

import { FiChevronDown } from "react-icons/fi"
import hero from "@/assets/logo.png"
import { fetchNotifications } from "@/redux/slice/notificationSlice"

export default function Navbar({ onBarClicked }) {
  const { loading, items } = useSelector((store) => store.notification)
  const dispatch = useDispatch()

  const { user } = useSelector((store) => store.user)
  const [query, setIsQuery] = useState("")

  const unreadMsgLength = 2

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

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
            to={"/user/notification"}
            className="relative w-7 h-7 flex items-center justify-center"
          >
            <Bell size={23} />
            {!loading && unreadMsgLength > 0 && (
              <span className="absolute w-5 h-5 -top-2 -right-2 rounded-full text-sm flex items-center justify-center text-white bg-red-600">
                {unreadMsgLength}
              </span>
            )}
          </Link>
          <div className="w-56 h-full flex items-center justify-between space-x-2">
            <div className="flex items-center gap-4">
              <img
                src={hero}
                alt="Logo"
                className="w-12 h-12 rounded-full cursor-pointer"
              />
              <section className="">
                <h2 className="font-semibold text-gray-800 text-[15px] cursor-pointer hidden md:block">
                  {user?.fullName}
                </h2>
                <p className="uppercase font-semibold text-[13px] text-blue-500 ">
                  {user?.role}
                </p>
              </section>
            </div>
            <FiChevronDown size={22} className="cursor-pointer" />
          </div>
        </section>
      </div>
    </>
  )
}
