import React, { useState } from "react"
import { motion } from "framer-motion"
import { sendEmail } from "@/services/sendEmail"
import toast from "react-hot-toast"

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [formStatus, setFormStatus] = useState(null) // For feedback after form submission

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await sendEmail(formData)

      if (res?.success) {
        setFormStatus(res.message)
        toast.success(res.message)
      } else {
        setFormStatus(res.message)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setFormStatus(
        "There was an error sending your message. Please try again."
      )
      toast.error("There was an error sending your message. Please try again.")
    }
  }

  return (
    <motion.div
      className=" bg-white py-8 rounded-lg "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-gray-800 my-8">Contact Us</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-[70%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-[70%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Subject
          </label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="w-[70%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="w-[70%] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            required
          ></textarea>
        </div>
        {formStatus && (
          <motion.div
            className="bg-green-100 text-green-700 p-3 mb-4 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {formStatus}
          </motion.div>
        )}
        <button
          type="submit"
          className="w-48 cursor-pointer p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
        >
          Send Message
        </button>
      </form>
    </motion.div>
  )
}

export default ContactForm
