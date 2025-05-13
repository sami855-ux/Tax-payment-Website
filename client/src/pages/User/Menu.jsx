import { MdHistory, MdPayment, MdSupportAgent } from "react-icons/md"
import { FiLogOut, FiMoreHorizontal } from "react-icons/fi"
import { AiOutlineSetting } from "react-icons/ai"
import { RiFileList3Line } from "react-icons/ri"
import DashboardLink from "@/ui/DashboardLink"
import { HiOutlineHome } from "react-icons/hi"
import { useDispatch, useSelector } from "react-redux"

import { logout } from "@/redux/slice/userSlice"
import { logoutUser } from "@/services/apiUser"
import { useNavigate } from "react-router-dom"
import hero from "@/assets/logo.png"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { getApprovedTaxFilingsForUser } from "@/services/Tax"
import { Landmark } from "lucide-react"

export default function Menu({ approved }) {
  const { user } = useSelector((store) => store.user)
  const { schedules } = useSelector((store) => store.filled)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isTaxSetupFinished = user?.isTaxSetupComplete

  const handleLogout = async () => {
    const res = await logoutUser()

    if (res.success) {
      dispatch(logout())
      localStorage.removeItem("userId")
      toast.success(res.message)
      navigate("/")
    }
  }

  return (
    <>
      <div
        className={` md:w-22 lg:w-72 h-full flex items-center flex-col py-7 fixed transition ease-in-out duration-200`}
      >
        <section className="w-72 hidden lg:flex justify-center gap-3 items-center">
          <img src={hero} alt="Logo" className="w-9 h-9 rounded-full" />
          <h2 className="font-semibold text-2xl text-gray-900">Falinber</h2>
        </section>

        <ul
          className={`md:w-22 lg:w-72 h-96 py-7 transition ease-in-out duration-200`}
        >
          <li className="pl-5 mb-3">
            <span className="font-semibold text-[14px] text-gray-600 md:hidden lg:block">
              {" "}
              Main menu
            </span>
            <span className="font-semibold text-[14px] text-gray-600 lg:hidden">
              <FiMoreHorizontal size={22} />
            </span>
          </li>

          <DashboardLink
            text={"Dashboard"}
            path="/user/dashboard"
            icon={<HiOutlineHome size={23} />}
          />
          <DashboardLink
            text={"Pay Tax"}
            path="/user/payTax"
            icon={<MdPayment size={23} />}
            disabled={!isTaxSetupFinished || approved?.length == 0}
          />
          <DashboardLink
            text={"Tax Filing"}
            path="/user/taxFilling"
            icon={<RiFileList3Line size={23} />}
            disabled={!isTaxSetupFinished}
          />
          <DashboardLink
            text={"Payment History"}
            path="/user/history"
            icon={<MdHistory size={23} />}
            disabled={!isTaxSetupFinished}
          />
          <DashboardLink
            text={"Tax setup"}
            path="/user/complete-tax-setup"
            icon={<Landmark size={23} />}
            disabled={!isTaxSetupFinished}
          />
          <li className="pl-5 my-3">
            <span className="font-semibold text-[14px] text-gray-600 md:hidden lg:block">
              {" "}
              Other
            </span>
            <span className="font-semibold text-[14px] text-gray-600 lg:hidden">
              <FiMoreHorizontal size={22} />
            </span>
          </li>
          <DashboardLink
            text={"Setting"}
            path="/user/setting"
            icon={<AiOutlineSetting size={23} />}
          />
          <DashboardLink
            text={"Help center"}
            path="/user/help"
            icon={<MdSupportAgent size={23} />}
          />
          <li
            className={`w-[260px] md:w-[65px] lg:w-[260px] relative `}
            onClick={handleLogout}
          >
            <p
              className={`nav-item flex items-center gap-3.5 px-4 py-3 rounded-md w-full cursor-pointer`}
            >
              <span className="icon">
                <FiLogOut size={23} />
              </span>
              <span className={`hidden lg:inline  label `}>Logout</span>
            </p>
          </li>
        </ul>
      </div>
    </>
  )
}

export const MobileMenu = ({ onBarClicked }) => {
  return (
    <ul
      className={`w-72 h-full fixed z-100 bg-white py-7 transition ease-in-out duration-200`}
    >
      <section className="w-72 flex justify-center gap-3 items-center">
        <img src={hero} alt="Logo" className="w-9 h-9 rounded-full" />
        <h2 className="font-semibold text-2xl text-gray-900">Falinber</h2>
      </section>

      <li className="pl-5 my-3 ">
        <span className="font-semibold text-[14px] text-gray-600 ">
          {" "}
          Main menu
        </span>
      </li>

      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Dashboard"}
          path="/user"
          icon={<HiOutlineHome size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Pay Tax"}
          path="/user/dashboard"
          icon={<MdPayment size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Tax Filing"}
          path="/user/dashboard"
          icon={<RiFileList3Line size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Payment History"}
          path="/user/dashboard"
          icon={<MdHistory size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Setting"}
          path="/user/dashboard"
          icon={<AiOutlineSetting size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Help center"}
          path="/user/dashboard"
          icon={<MdSupportAgent size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Logout"}
          path="/user/dashboard"
          icon={<FiLogOut size={23} />}
        />
      </span>
    </ul>
  )
}
