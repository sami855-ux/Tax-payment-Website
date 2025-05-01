import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Upload, User, Mail, Lock, ShieldCheck } from "lucide-react"

export default function Profile() {
  const [profilePic, setProfilePic] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    document.title = "Admin profile"
  }, [])

  return (
    <div className="min-h-screen w-full px-4">
      <div className="max-w-3xl bg-white p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className=" mb-10 pt-7"
        >
          <h1 className="text-4xl font-bold mb-2 text-gray-800">
            Update profile
          </h1>
          <p className="text-gray-500">
            Manage platform settings, profile, and preferences
          </p>
        </motion.div>

        {/* Profile Image */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <img
              src={profilePic || "https://via.placeholder.com/120"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow"
            />
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer">
              <Upload size={16} />
              <input
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <div>
            <p className="text-gray-700 font-medium">Profile Picture</p>
            <p className="text-sm text-gray-500">Click icon to update</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5">
          <div>
            <label className="text-gray-600 text-sm mb-1 block">
              Full Name
            </label>
            <div className="relative ">
              <User
                stroke="blue
              "
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="John Doe"
                className="pl-10 py-2 mt-1 w-full rounded-xl border border-gray-300 hover:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-1 block">Email</label>
            <div className="relative">
              <Mail
                stroke="green
              "
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="email"
                placeholder="admin@example.com"
                className="pl-10 py-2 mt-1 w-full rounded-xl border border-gray-300 hover:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-1 block">Role</label>
            <div className="relative">
              <ShieldCheck
                stroke="orange"
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Administrator"
                disabled
                className="pl-10 py-2 mt-1 w-full rounded-xl border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-1 block">Password</label>
            <div className="relative">
              <Lock
                stroke="red"
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="password"
                placeholder="••••••••"
                className="pl-10 py-2 mt-1 w-full rounded-xl border border-gray-300 hover:border-gray-400"
              />
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-6 w-48 cursor-pointer px-10 bg-blue-600 text-white py-3 rounded-xl  hover:bg-blue-700 transition duration-300"
          >
            Update profile
          </motion.button>
        </form>
      </div>
    </div>
  )
}
