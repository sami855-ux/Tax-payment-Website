import { Link } from "react-scroll"
import ButtonTwo from "../ui/ButtonTwo"
import logo from "../assets/logo.png"
import { FaBars, FaTimes } from "react-icons/fa"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Header() {
  const [isBarClicked, setIsBarClicked] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 ${
        scrolled ? "bg-white shadow-md" : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <img
              src={logo}
              alt="Flainber logo"
              className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full"
            />
            <h1 className="font-bold text-gray-800 text-xl md:text-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text">
              Flainber
            </h1>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavItem path="home" text="Home" />
            <NavItem path="service" text="Services" />
            <NavItem path="insight" text="Insight" />
            <NavItem path="testimonial" text="Testimonial" />
            <NavItem path="contact" text="Contact" />
          </nav>

          {/* CTA Button - Desktop */}
          <div className="hidden md:block">
            <ButtonTwo />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsBarClicked(!isBarClicked)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isBarClicked ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isBarClicked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
              className="px-4 pt-2 pb-6 space-y-4"
            >
              <NavItem
                path="home"
                text="Home"
                mobile
                onClick={() => setIsBarClicked(false)}
              />
              <NavItem
                path="service"
                text="Services"
                mobile
                onClick={() => setIsBarClicked(false)}
              />
              <NavItem
                path="insight"
                text="Insight"
                mobile
                onClick={() => setIsBarClicked(false)}
              />
              <NavItem
                path="testimonial"
                text="Testimonial"
                mobile
                onClick={() => setIsBarClicked(false)}
              />
              <NavItem
                path="contact"
                text="Contact"
                mobile
                onClick={() => setIsBarClicked(false)}
              />
              <div className="pt-4">
                <ButtonTwo fullWidth onClick={() => setIsBarClicked(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

const NavItem = ({ path, text, mobile = false, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: mobile ? 1.02 : 1.05 }}
      className={`${mobile ? "block" : "inline-block"} relative group`}
    >
      <Link
        activeClass="active"
        spy={true}
        smooth={true}
        offset={-80}
        duration={500}
        to={path}
        onClick={onClick}
        className={`${
          mobile
            ? "block px-4 py-3 text-gray-800 hover:bg-gray-100 rounded-lg text-lg font-medium"
            : "px-3 py-2 text-gray-700 hover:text-blue-600 text-base font-medium"
        } cursor-pointer transition-colors`}
      >
        {text}
        {!mobile && (
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 bg-blue-600 w-0 group-hover:w-full transition-all duration-300"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
          />
        )}
      </Link>
    </motion.div>
  )
}
