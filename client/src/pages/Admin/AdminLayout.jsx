import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

import Navbar from "./Navbar"
import Menu, { MobileMenu } from "./Menu"
import { useDispatch } from "react-redux"
import axios from "axios"
import { login, logout } from "@/redux/slice/userSlice"
import {
  clearNotifications,
  fetchNotifications,
} from "@/redux/slice/notificationSlice"
import { getUserById } from "@/services/apiUser"

export default function AdminLayout() {
  const [isBarClicked, setIsBarClicked] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleBarClicked = () => {
    setIsBarClicked((curr) => !curr)
  }

  useEffect(() => {
    const getUserInfo = async () => {
      const res = await getUserById()

      if (res.success) {
        dispatch(
          login({
            user: res.user,
          })
        )

        dispatch(clearNotifications())
      }
    }

    getUserInfo()

    dispatch(fetchNotifications())
    const checkUserSession = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth`,
          {
            withCredentials: true,
          }
        )

        if (response.data.success) {
          console.log(response)
        } else {
          navigate("/")
        }
      } catch (error) {
        console.log(error)

        dispatch(logout())
        navigate("/")
      }
    }

    checkUserSession()
  }, [dispatch])

  return (
    <div className="w-full h-screen flex">
      {isBarClicked ? (
        <div
          className="fixed w-screen h-screen inset-0 bg-black/30 backdrop-blur-sm z-60"
          onClick={handleBarClicked}
        ></div>
      ) : null}
      {/* MobileMenu */}
      {isBarClicked && <MobileMenu onBarClicked={handleBarClicked} />}
      <div
        className={`md:block invisible md:visible md:w-22 lg:w-72 h-full bg-stone-100 transition ease-in-out duration-200 border-r border-stone-300`}
      >
        <Menu isBarClicked={isBarClicked} />
      </div>
      <div className="min-h-screen md:w-[calc(100vw-5.5rem)] lg:w-[calc(100vw-18rem)]">
        <Navbar onBarClicked={handleBarClicked} />
        <Outlet />
      </div>
    </div>
  )
}
