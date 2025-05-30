import { MdHistory, MdPayment, MdSupportAgent } from "react-icons/md"
import {
  FiActivity,
  FiBriefcase,
  FiCheckCircle,
  FiFileText,
  FiLogOut,
  FiMoreHorizontal,
  FiTool,
  FiUser,
  FiUsers,
} from "react-icons/fi"
import { AiOutlineSetting } from "react-icons/ai"
import { RiFileList3Line } from "react-icons/ri"
import { useNavigate } from "react-router-dom"
import { HiOutlineHome } from "react-icons/hi"
import toast from "react-hot-toast"

import { logout } from "@/redux/slice/userSlice"
import { logoutUser } from "@/services/apiUser"
import DashboardLink from "@/ui/DashboardLink"
import hero from "@/assets/image.png"
import { useDispatch } from "react-redux"
import { Banknote, Coins, ReceiptText, Wrench } from "lucide-react"

export default function Menu() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

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
          <h2 className="font-semibold text-xl text-gray-900">
            Debre brihan <br /> tax system
          </h2>
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
            path="/admin/dashboard"
            icon={<HiOutlineHome size={23} />}
          />
          <DashboardLink
            text={"Manage Users"}
            path="/admin/manage-users"
            icon={<FiUsers size={23} />}
          />

          <DashboardLink
            text={"Manage tax"}
            path="/admin/manage-tax"
            icon={<FiFileText size={23} />}
          />
          <DashboardLink
            text={"Tax Payment Logs"}
            path="/admin/payment-log"
            icon={<Coins size={23} />}
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
            path="/admin/setting"
            icon={<AiOutlineSetting size={23} />}
          />
          <DashboardLink
            text={"System Maintenance"}
            path="/admin/maintenance"
            icon={<Wrench size={23} />}
          />
          <DashboardLink
            text={"Reports & Analytics"}
            path="/admin/report"
            icon={<FiActivity size={23} />}
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
              <span className={`hidden lg:inline label `}>Logout</span>
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
        <h2 className="font-semibold text-xl text-gray-900">
          {" "}
          Debre brihan tax system
        </h2>
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
          path="/admin/dashboard"
          icon={<HiOutlineHome size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Pay Tax"}
          path="/admin/manage-users"
          icon={<MdPayment size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Tax Filing"}
          path="/admin/manage-tax"
          icon={<RiFileList3Line size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Payment History"}
          path="/admin/payment-log"
          icon={<MdHistory size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Setting"}
          path="/admin/setting"
          icon={<AiOutlineSetting size={23} />}
        />
      </span>
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"System Maintenance"}
          path="/admin/maintenance"
          icon={<MdSupportAgent size={23} />}
        />
      </span>
      <DashboardLink
        text={"Reports & Analytics"}
        path="/admin/report"
        isMobileMenu={true}
        icon={<FiActivity size={23} />}
      />
      <span onClick={onBarClicked}>
        <DashboardLink
          isMobileMenu={true}
          text={"Logout"}
          path="/admin/"
          icon={<FiLogOut size={23} />}
        />
      </span>
    </ul>
  )
}
