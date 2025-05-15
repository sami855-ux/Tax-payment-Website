import { GoCheckCircleFill } from "react-icons/go"
import { FaShieldAlt } from "react-icons/fa"
import { MdCalculate } from "react-icons/md"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Services() {
  const services = [
    {
      icon: <GoCheckCircleFill size={50} />,
      title: "Online Tax Filing",
      description:
        "Easily file your taxes online with our user-friendly platform. Whether you're an individual, freelancer, or business owner, we guide you step by step to ensure accuracy and compliance.",
      color: "from-blue-600 to-cyan-500",
    },
    {
      icon: <FaShieldAlt size={50} />,
      title: "Secure Tax Payments",
      description:
        "Make tax payments directly through our secure portal using multiple payment options, including bank transfers, credit/debit cards, and digital wallets.",
      color: "from-purple-600 to-indigo-500",
    },
    {
      icon: <MdCalculate size={50} />,
      title: "Tax Calculator & Estimation",
      description:
        "Get an accurate estimate of your taxes before filing. Our advanced tax calculator helps you understand your obligations and avoid surprises.",
      color: "from-green-600 to-emerald-500",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section
      className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50"
      id="service"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-transparent bg-clip-text pb-2">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, secure, and efficient tax solutions tailored for your needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Feature Card */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-xl p-8 text-white flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold mb-4">Our Services</h3>
            <p className="text-blue-100">
              Experience simple and secure tax payments with real-time tracking,
              automated reminders, and more
            </p>
            <div className="mt-6">
              <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-opacity-90 transition-all">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Service Cards */}
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
              variants={itemVariants}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

const ServiceCard = ({ icon, title, description, color, variants }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
    >
      <div className="p-6 h-full flex flex-col">
        <motion.div
          animate={{
            rotateY: isHovered ? 360 : 0,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.5 }}
          className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} text-white flex items-center justify-center mb-6 mx-auto`}
        >
          {icon}
        </motion.div>

        <motion.h3
          animate={{
            color: isHovered ? "#0284c7" : "#1e293b",
          }}
          className="text-xl font-semibold text-gray-800 text-center mb-4"
        >
          {title}
        </motion.h3>

        <p className="text-gray-600 text-center flex-1">{description}</p>

        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
          }}
          className="mt-6 text-center"
        >
          <button
            className={`px-4 py-2 bg-gradient-to-br ${color} text-white rounded-lg text-sm font-medium hover:opacity-90 transition-all`}
          >
            Discover More
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
