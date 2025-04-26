import { Link } from "react-scroll"
import ButtonTwo from "../ui/ButtonTwo"
import logo from "../assets/logo.png"
import { FaBars, FaTimes } from "react-icons/fa"
import { useState } from "react"

export default function Header() {
  const [isBarClicked, setIsBarClicked] = useState(false)

  return (
    <div className="w-full lg:w-[93%] lg:left-12 py-2 h-[70px] flex items-center fixed top-0 md:top-2 left-0 px-2 md:px-14 lg:px-20 bg-slate-50 z-100 lg:rounded-2xl ">
      <div className="h-full flex items-center w-56 gap-4">
        <img
          src={logo}
          alt="Logo for the website"
          className="w-14 h-14 object-cover rounded-full"
        />
        <h1 className="font-semibold text-gray-800 text-xl">Flainber</h1>
      </div>

      <ul className="w-fit h-16 hidden md:flex items-center gap-6 ml-7 ">
        <ItemLink path="home" text="Home" />
        <ItemLink path="service" text="Services" />
        <ItemLink path="insight" text="Insight" />
        <ItemLink path="testimonial" text="Testimonial" />
        <ItemLink path="contact" text="More" />
      </ul>
      <span className="md:hidden flex ml-auto">
        {isBarClicked ? (
          <FaTimes
            size={20}
            className="cursor-pointer hover:text-stone-600 font-light"
            onClick={() => setIsBarClicked(false)}
          />
        ) : (
          <FaBars
            size={20}
            className="cursor-pointer hover:text-stone-600 font-light"
            onClick={() => setIsBarClicked(true)}
          />
        )}
      </span>

      <span className="ml-auto hidden lg:block ">
        <ButtonTwo />
      </span>

      {/* Overlay */}
      {isBarClicked && (
        <div
          onClick={() => setIsBarClicked(false)}
          className="w-screen h-dvh bg-stone-900/75  absolute z-90  top-[70px] left-0  block md:hidden"
        ></div>
      )}

      {/* Mobile Menu */}
      {isBarClicked && (
        <div
          className={`${
            isBarClicked ? "h-60" : "h-0"
          } absolute top-[70px] z-100 w-screen transition ease-in-out left-0 duration-100 bg-white block md:hidden p-3`}
        >
          <ul className="w-full h-16 flex items-center gap-3 flex-col ">
            <ItemLink
              path="home"
              text="Home"
              onClick={() => setIsBarClicked(false)}
            />
            <ItemLink
              path="service"
              text="Services"
              onClick={() => setIsBarClicked(false)}
            />
            <ItemLink
              path="insight"
              text="Insight"
              onClick={() => setIsBarClicked(false)}
            />
            <ItemLink
              path="testimonial"
              text="Testimonial"
              onClick={() => setIsBarClicked(false)}
            />
            <ItemLink
              path="contact"
              text="More"
              onClick={() => setIsBarClicked(false)}
            />
          </ul>
        </div>
      )}
    </div>
  )
}

const ItemLink = ({ path, text, onClick = null }) => {
  return (
    <li className="nav-link">
      <Link
        activeClass="activeItem"
        spy={true}
        smooth={true}
        offset={-100}
        duration={500}
        to={path}
        onClick={onClick}
        className={`text-gray-800 text-[16px] cursor-pointer`}
      >
        {text}
      </Link>
    </li>
  )
}
