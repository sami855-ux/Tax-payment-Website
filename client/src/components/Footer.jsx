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
  return (
    <div
      className="w-full min-h-[45vh] bg-[#064995] text-white flex justify-center items-center flex-col gap-3"
      id="contact"
    >
      <section className="w-full md:w-[87%] min-h-72 md:pt-16 flex flex-col md:flex-row gap-7 justify-center items-center mt-32 md:mt-0 ">
        <div className="w-[420px] h-full">
          <p className="text-[14px] text-gray-200">
            Get an accurate estimate of your taxes before filing. Our advanced
            tax calculator helps you understand your obligations and avoid
            surprises.
          </p>

          <section className="flex items-center w-full gap-3 h-28">
            <Icon icon={<FaFacebookF color="white" />} href="#" />
            <Icon icon={<FaTwitter color="white" />} href="#" />
            <Icon icon={<FaInstagram color="white" />} href="#" />
            <Icon icon={<FaLinkedinIn color="white" />} href="#" />
          </section>
        </div>
        <div className="flex flex-col w-full min-h-full gap-3 pl-12 md:w-fit md:pl-0 md:flex-row">
          <FooterSection
            header=" Useful links"
            textList={[
              "Privacy Policy",
              "Our Service",
              "About Website",
              "Forums",
              "Categories",
              "Latest Products",
              "Testimonials",
            ]}
          />
          <FooterSection
            header="Quick access"
            textList={[
              "MarketPlaces",
              "Licensees",
              "Review",
              "Refund",
              "Contact us",
              "Support Policy",
            ]}
          />
          <FooterSection
            header="More links"
            textList={[
              "About us",
              "Our projects",
              "Our office",
              "Our location",
              "Who we are?",
            ]}
          />
        </div>
      </section>
      <div className="flex items-center justify-between w-full px-4 md:px-40 min-h-16 bg-[#064995]">
        <p className="text-xs text-white"> &copy; All right are reserved</p>

        <section className="flex gap-4 ">
          <a href="#" className="text-xs text-white">
            Privacy policy
          </a>
          <a href="#" className="text-xs text-white">
            About us
          </a>
          <a href="#" className="text-xs text-white">
            Contact
          </a>
        </section>
      </div>
    </div>
  )
}

const Icon = ({ icon, href }) => {
  return (
    <a
      href={href}
      className="flex items-center justify-center rounded-full cursor-pointer w-9 h-9 bg-lightGreen"
    >
      {icon}
    </a>
  )
}

const FooterSection = ({ header, textList }) => {
  return (
    <section className="w-[200px]">
      <h2 className="py-3 text-xs font-semibold text-gray-200 uppercase">
        {header}
      </h2>
      <div className="relative w-[90%] h-5 flex justify-center items-center">
        <span className="w-2 h-2 rounded-full bg-brown/50"></span>
        <span className="w-full h-[1px] bg-brown/50"></span>
      </div>
      <div className="flex flex-col justify-center w-full gap-1">
        {textList.map((list, listIndex) => (
          <FooterList text={list} key={listIndex} />
        ))}
      </div>
    </section>
  )
}

const FooterList = ({ text }) => {
  const [isHover, setIsHover] = useState(false)

  return (
    <motion.section
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      animate={{
        x: isHover ? 5 : 0,
      }}
      className="flex items-center w-full h-5 gap-2 cursor-pointer"
    >
      <FaAngleRight color="#22c55e" size={15} />
      <motion.span
        animate={{
          fontWeight: isHover ? "bold" : "",
          color: isHover ? "#22c55e" : "",
        }}
        className="text-xs text-gray-200"
      >
        {text}
      </motion.span>
    </motion.section>
  )
}
