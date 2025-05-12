import { NavLink } from "react-router-dom"

export default function DashboardLink({
  path = "",
  text,
  icon,
  isMobileMenu = false,
  disabled = false,
}) {
  const baseClass =
    "nav-item flex items-center gap-3.5 px-4 py-3 rounded-md w-full"
  const widthClass = isMobileMenu ? "w-[260px]" : "md:w-[65px] lg:w-[260px]"

  return (
    <li className={`${widthClass} relative`}>
      {disabled ? (
        <div
          className={`${baseClass} opacity-50 pointer-events-none bg-gray-100 cursor-not-allowed`}
        >
          <span className="icon">{icon}</span>
          <span
            className={`${
              isMobileMenu ? "" : "hidden lg:inline"
            } label text-[15px]`}
          >
            {text}
          </span>
        </div>
      ) : (
        <NavLink
          to={path}
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "active" : ""}`
          }
        >
          <span className="icon">{icon}</span>
          <span
            className={`${
              isMobileMenu ? "" : "hidden lg:inline"
            } label text-[15px]`}
          >
            {text}
          </span>
        </NavLink>
      )}
    </li>
  )
}
