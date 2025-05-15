import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaAngleRight,
} from "react-icons/fa"
import { useState } from "react"
import { motion } from "framer-motion"

export default function Footer() {
  const footerLinks = [
    {
      header: "Useful links",
      links: [
        "Privacy Policy",
        "Our Service",
        "About Website",
        "Forums",
        "Categories",
        "Latest Products",
        "Testimonials",
      ],
    },
    {
      header: "Quick access",
      links: [
        "MarketPlaces",
        "Licensees",
        "Review",
        "Refund",
        "Contact us",
        "Support Policy",
      ],
    },
    {
      header: "More links",
      links: [
        "About us",
        "Our projects",
        "Our office",
        "Our location",
        "Who we are?",
      ],
    },
  ]

  return (
    <footer
      className="w-full bg-gradient-to-b from-[#064995] to-[#04356e] text-white"
      id="contact"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-10"
        >
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
              TaxEasy
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Get an accurate estimate of your taxes before filing. Our advanced
              tax calculator helps you understand your obligations.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <SocialIcon
                icon={<FaFacebookF />}
                color="bg-blue-600 hover:bg-blue-700"
              />
              <SocialIcon
                icon={<FaTwitter />}
                color="bg-cyan-500 hover:bg-cyan-600"
              />
              <SocialIcon
                icon={<FaInstagram />}
                color="bg-pink-600 hover:bg-pink-700"
              />
              <SocialIcon
                icon={<FaLinkedinIn />}
                color="bg-blue-700 hover:bg-blue-800"
              />
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <FooterSection
              key={index}
              header={section.header}
              links={section.links}
            />
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          className="border-t border-gray-700 mt-12"
        />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 pb-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TaxEasy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <FooterLink text="Privacy policy" />
            <FooterLink text="About us" />
            <FooterLink text="Contact" />
          </div>
        </div>
      </div>
    </footer>
  )
}

const SocialIcon = ({ icon, color }) => {
  return (
    <motion.a
      href="#"
      whileHover={{ y: -3 }}
      className={`w-10 h-10 rounded-full ${color} text-white flex items-center justify-center transition-colors`}
    >
      {icon}
    </motion.a>
  )
}

const FooterSection = ({ header, links }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
        {header}
      </h4>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <FooterListItem key={index} text={link} />
        ))}
      </ul>
    </div>
  )
}

const FooterListItem = ({ text }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.li
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center"
    >
      <motion.div
        animate={{
          rotate: isHovered ? 90 : 0,
          color: isHovered ? "#22d3ee" : "#9ca3af",
        }}
        transition={{ duration: 0.2 }}
      >
        <FaAngleRight size={12} />
      </motion.div>
      <motion.a
        href="#"
        animate={{
          x: isHovered ? 5 : 0,
          color: isHovered ? "#22d3ee" : "#e5e7eb",
        }}
        className="ml-2 text-sm hover:underline"
      >
        {text}
      </motion.a>
    </motion.li>
  )
}

const FooterLink = ({ text }) => {
  return (
    <motion.a
      href="#"
      whileHover={{ color: "#22d3ee" }}
      className="text-gray-400 text-sm hover:underline transition-colors"
    >
      {text}
    </motion.a>
  )
}
