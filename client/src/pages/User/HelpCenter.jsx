import React, { useState } from "react"
import { motion } from "framer-motion"
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaFileAlt,
  FaCog,
  FaInfoCircle,
} from "react-icons/fa"
import ContactForm from "./ContactForm"

// Accordion Item Component
const AccordionItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => setIsOpen(!isOpen)

  return (
    <motion.div
      className="accordion-item bg-white p-4 mb-4 rounded-lg shadow-md"
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="accordion-header flex justify-between items-center cursor-pointer text-lg font-semibold text-gray-800"
        onClick={toggleAccordion}
      >
        <h3 className="text-[16px]">{question}</h3>
        {isOpen ? (
          <FaChevronUp className="text-blue-500" />
        ) : (
          <FaChevronDown className="text-blue-500" />
        )}
      </div>
      {isOpen && (
        <div className="accordion-body mt-2 text-gray-600">{answer}</div>
      )}
    </motion.div>
  )
}

// Help Center Component
const HelpCenter = () => {
  return (
    <motion.div
      className="help-center px-16 py-10 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="header text-center mb-12">
        <h1 className="text-xl font-bold text-gray-800">
          How can we help you today?
        </h1>
        <p className="text-[16px] text-gray-600 mt-2">
          Search for answers or browse by category.
        </p>
        <input
          type="text"
          placeholder="Search help articles, topics, FAQs..."
          className="mt-4 w-full sm:w-2/3 lg:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Popular Articles Section */}
      <motion.div
        className="popular-articles"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Popular Articles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-pink-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer text-center">
            <FaFileAlt className="text-3xl text-indigo-500 mx-auto mb-4" />
            <p className="text-[17px] font-medium text-gray-800">
              How to file your taxes online
            </p>
          </div>
          <div className="card bg-green-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer text-center">
            <FaCog className="text-3xl text-green-500 mx-auto mb-4" />
            <p className="text-[17px] font-medium text-gray-800">
              Resetting your account password
            </p>
          </div>
          <div className="card bg-yellow-200 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer text-center">
            <FaQuestionCircle className="text-3xl text-yellow-500 mx-auto mb-4" />
            <p className="text-[17px] font-medium text-gray-800">
              What to do if you miss a payment
            </p>
          </div>
        </div>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        className="categories mt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer text-center">
            <h3 className="text-lg font-semibold text-blue-700">
              Getting Started
            </h3>
            <p className="text-gray-600">
              Set up your account and get ready to pay taxes.
            </p>
          </div>
          <div className="card bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer text-center">
            <h3 className="text-lg font-semibold text-green-700">
              Payments & Billing
            </h3>
            <p className="text-gray-600">
              Pay taxes, update payment methods, track history.
            </p>
          </div>
          <div className="card bg-yellow-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer text-center">
            <h3 className="text-lg font-semibold text-yellow-700">
              Account Management
            </h3>
            <p className="text-gray-600">
              Profile settings, security, and recovery steps.
            </p>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section with Accordion */}
      <motion.div
        className="faq-section mt-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">FAQs</h2>
        <div className="accordion">
          <AccordionItem
            question="How to reset my password?"
            answer="Click 'Forgot password' on the login page, enter your email, and follow the instructions."
          />
          <AccordionItem
            question="How long does it take for a payment to process?"
            answer="Payments usually process within 1-2 business days, depending on your bank."
          />
          <AccordionItem
            question="What happens if I miss a payment?"
            answer="You will receive a reminder email, and there may be late fees or penalties."
          />
        </div>
      </motion.div>

      <ContactForm />
    </motion.div>
  )
}

export default HelpCenter
