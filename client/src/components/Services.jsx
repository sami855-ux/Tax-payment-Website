import { GoCheckCircleFill } from "react-icons/go"
import { FaShieldAlt } from "react-icons/fa"
import { MdCalculate } from "react-icons/md"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Services() {
  return (
    <div className="min-h-[65vh] pb-5 mx-28" id="service">
      <section className="md:w-[70%] lg:w-fit min-h-96 grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-1 gap-7">
        <div className="w-[300px] md:h-[240px] lg:w-[300px] lg:h-[90%] bg-gradient-to-b from-blue-500 to-green-400 p-4 pt-10 rounded-md ">
          <h2 className="text-2xl text-white font-semibold">Our services</h2>
          <p className=" text-white pt-5 font-light">
            Experience simple and secure tax payments with real-time tracking,
            automated reminders, and more
          </p>
        </div>
        <Card
          img={<GoCheckCircleFill color="#166aaf" size={50} />}
          header="Online Tax Filing"
          subheader=" Easily file your taxes online with our user-friendly platform. Whether you're an individual, freelancer, or business owner, we guide you step by step to ensure accuracy and compliance. "
        />
        <Card
          img={<FaShieldAlt color="#166aaf" size={50} />}
          header="Secure Tax Payments"
          subheader="Make tax payments directly through our secure portal using multiple payment options, including bank transfers, credit/debit cards, and digital wallets."
        />
        <Card
          img={<MdCalculate color="#166aaf" size={50} />}
          header=" Tax Calculator & Estimation"
          subheader=" Get an accurate estimate of your taxes before filing. Our advanced tax calculator helps you understand your obligations and avoid surprises. "
        />
      </section>
    </div>
  )
}

const Card = ({ img, header, subheader }) => {
  const [isHover, setIsHover] = useState(false)
  return (
    <motion.div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      animate={{
        y: isHover ? -15 : 0,
      }}
      transition={{
        ease: "easeIn",
        duration: 0.2,
      }}
      className="md:h-ful w-[300px] md:w-[260px] lg:w-[300px] lg:h-[90%] bg-white shadow-md rounded-md px-7 py-5 border border-slate-200 cursor-pointer flex justify-center flex-col items-center"
    >
      <motion.div
        animate={{
          rotateY: isHover ? 360 : 0,
        }}
        transition={{ duration: 0.5 }}
        src={img}
        alt="image of the card"
        className="w-14 h-14"
      >
        {img}
      </motion.div>
      <motion.h2
        animate={{
          fontWeight: isHover ? "bold" : "",
          color: isHover ? "#01849f" : "",
        }}
        className="text-gray-800 text-lg font-semibold pt-5 text-center"
      >
        {header}
      </motion.h2>
      <p className="font-light text-gray-700 text-sm pt-5 text-center">
        {" "}
        {subheader}
      </p>
    </motion.div>
  )
}
