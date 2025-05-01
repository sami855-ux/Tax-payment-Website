import { motion } from "framer-motion"

export default function SectionWrapper({ children, title }) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h3 className="text-3xl font-bold text-gray-800 mb-6">{title}</h3>
      <div className="space-y-4">{children}</div>
    </motion.div>
  )
}
