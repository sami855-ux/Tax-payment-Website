import { AiOutlineCloseCircle } from "react-icons/ai"
import { HiOutlineSearch } from "react-icons/hi"
import { HiBars3CenterLeft } from "react-icons/hi2"
import { IoMdNotificationsOutline } from "react-icons/io"
import { useEffect, useRef, useState } from "react"

import hero from "@/assets/logo.png"
import {
  FiChevronDown,
  FiCreditCard,
  FiHelpCircle,
  FiLogOut,
  FiSettings,
  FiUser,
} from "react-icons/fi"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Bell } from "lucide-react"
import { logoutUser } from "@/services/apiUser"
import { logout } from "@/redux/slice/userSlice"
import toast from "react-hot-toast"

export default function Navbar({ onBarClicked }) {
  const { loading, items } = useSelector((store) => store.notification)
  const { user } = useSelector((store) => store.user)
  const [query, setIsQuery] = useState("")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  let unreadMsgLength = useRef()

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    const res = await logoutUser()

    if (res.success) {
      dispatch(logout())
      localStorage.removeItem("userId")
      toast.success(res.message)
      navigate("/")
      setIsOpen(false)
    }
  }

  useEffect(() => {
    unreadMsgLength.current = items.filter((n) => !n.read).length
  }, [items])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

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
            to={"/admin/notification"}
            className="relative w-7 h-7 flex items-center justify-center"
          >
            <Bell size={23} className="hover:text-green-700" />
            {!loading && unreadMsgLength.current > 0 && (
              <span className="absolute w-5 h-5 -top-2 -right-2 rounded-full text-sm flex items-center justify-center text-white bg-red-600">
                {unreadMsgLength.current}
              </span>
            )}
          </Link>
          <div className="relative" ref={dropdownRef}>
            <div
              className="min-w-56 h-full flex items-center justify-between space-x-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="flex items-center gap-4">
                <img
                  src={user?.profilePhoto || hero} // Assuming hero is a default image
                  alt="User"
                  className="w-12 h-12 rounded-full"
                />
                <section className="">
                  <h2 className="font-semibold text-gray-800 text-[15px] hidden md:block capitalize">
                    {user?.fullName}
                  </h2>
                  <p className="uppercase font-semibold text-[13px] text-blue-500">
                    {user?.role}
                  </p>
                </section>
              </div>
              <FiChevronDown
                size={22}
                className={`transition-transform duration-200 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-100">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => navigate("/admin/setting")}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <FiUser className="mr-3 text-gray-500" size={16} />
                    Profile
                    <span className="ml-auto bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                      New
                    </span>
                  </button>

                  <button
                    onClick={() => navigate("/admin/setting")}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <FiSettings className="mr-3 text-gray-500" size={16} />
                    Settings
                  </button>

                  <button
                    onClick={() => navigate("/admin/manage-users")}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <FiCreditCard className="mr-3 text-gray-500" size={16} />
                    Manage users
                  </button>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={() => navigate("/admin/report")}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
                  >
                    <FiHelpCircle className="mr-3 text-gray-500" size={16} />
                    Report and Analytics
                  </button>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <FiLogOut className="mr-3" size={16} />
                    Log Out
                  </button>
                </div>

                {/* Footer */}
                <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t border-gray-100">
                  v{1} • © 2023
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
