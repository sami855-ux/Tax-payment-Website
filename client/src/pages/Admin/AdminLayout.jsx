import { Outlet } from "react-router-dom"

import Navbar from "./Navbar"
import Menu from "./Menu"

export default function AdminLayout() {
  return (
    <div className="w-full h-screen flex gap-2">
      <div className="w-72 h-full bg-gray-400">
        <Menu />
      </div>
      <div className="bg-gray-600" style={{ width: "calc(100vw - 280px)" }}>
        {/* Nav bar */}
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}
