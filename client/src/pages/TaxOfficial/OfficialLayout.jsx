import { Outlet } from "react-router-dom"
import { useState } from "react"

import Navbar from "./Navbar"
import Menu, { MobileMenu } from "./Menu"

export default function OfficialLayout() {
  const [isBarClicked, setIsBarClicked] = useState(false)

  const handleBarClicked = () => {
    setIsBarClicked((curr) => !curr)
  }
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
