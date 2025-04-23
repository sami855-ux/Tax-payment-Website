import { Link } from "react-scroll"
import ButtonTwo from "../ui/ButtonTwo"
import logo from "../assets/logo.png"

export default function Header() {
  return (
    <div className="w-full h-[70px] flex items-center absolute top-2 left-0 px-20">
      <div className="h-full flex items-center w-56 gap-4">
        <img
          src={logo}
          alt="Logo for the website"
          className="w-14 h-14 object-cover rounded-full"
        />
        <h1 className="font-semibold text-gray-800 text-xl">Flainber</h1>
      </div>

      <ul className="w-fit h-16 flex items-center gap-6 ml-7">
        <ItemLink path="home" text="Home" />
        <ItemLink path="service" text="Services" />
        <ItemLink path="insight" text="Insight" />
        <ItemLink path="testimonial" text="Testimonial" />
        <ItemLink path="contact" text="More" />
      </ul>

      <ButtonTwo />
    </div>
  )
}

const ItemLink = ({ path, text }) => {
  return (
    <li>
      <Link
        activeClass="active"
        spy={true}
        smooth={true}
        offset={-50}
        duration={500}
        to={path}
        className="text-gray-800 text-[16px] cursor-pointer"
      >
        {text}
      </Link>
    </li>
  )
}
