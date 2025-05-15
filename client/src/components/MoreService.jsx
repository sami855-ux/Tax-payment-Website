import { motion } from "framer-motion"
import videoOne from "../assets/vid1.mp4"

export default function MoreService() {
  return (
    <section
      className="w-full min-h-screen relative overflow-hidden"
      id="insight"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoOne} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="relative z-10 flex flex-col justify-center items-center h-full px-4 sm:px-6 lg:px-8 py-24 text-center"
      >
        <motion.h2
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
        >
          Secure & Seamless <br />
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
            Payment Solutions
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl text-white/90 max-w-3xl mb-12"
        >
          Experience the future of tax payments with our cutting-edge platform
          designed for security, speed, and simplicity.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="px-8 py-3 bg-white text-blue-900 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl">
            Get Started
          </button>
          <button className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-900 transition-all">
            Learn More
          </button>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-10 left-10 opacity-20"
        >
          <div className="w-32 h-32 rounded-full bg-blue-400 blur-xl"></div>
        </motion.div>
        <motion.div
          animate={{
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-10 right-10 opacity-20"
        >
          <div className="w-40 h-40 rounded-full bg-cyan-400 blur-xl"></div>
        </motion.div>
      </motion.div>
    </section>
  )
}
