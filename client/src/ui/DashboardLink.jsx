import { NavLink } from "react-router-dom"

export default function DashboardLink({
  path = "",
  text,
  icon,
  isMobileMenu = false,
}) {
  return (
    <li
      className={`${
        isMobileMenu ? "w-[260px]" : "md:w-[65px] lg:w-[260px]"
      } relative `}
    >
      <NavLink
        to={path}
        className={({ isActive }) =>
          `nav-item ${
            isActive ? "active" : ""
          } flex items-center gap-3.5 px-4 py-3 rounded-md w-full`
        }
      >
        <span className="icon">{icon}</span>
        <span className={` ${isMobileMenu ? "" : "hidden lg:inline"} label `}>
          {text}
        </span>
      </NavLink>
    </li>
  )
}
