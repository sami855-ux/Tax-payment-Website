import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  UploadCloud,
  X,
  Check,
  Loader2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

const AdminProfileSettings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [imagePreview, setImagePreview] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Mock admin data
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1234567890",
    address: "123 Admin Street, Tech City",
    password: "",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: adminData,
  })

  // Reset form when adminData changes
  useEffect(() => {
    reset(adminData)
  }, [adminData, reset])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB")
        return
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Only JPG, PNG, or WEBP images are allowed")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setImageFile(null)
  }

  const onSubmit = async (data) => {
    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setAdminData((prev) => ({ ...prev, ...data }))
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <div className="flex items-center space-x-4">
            <Settings size={28} className="text-indigo-200" />
            <div>
              <h1 className="text-2xl font-bold">Admin Settings</h1>
              <p className="text-indigo-200">Manage your profile and account</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 font-medium flex items-center space-x-2 transition-colors ${
              activeTab === "profile"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User size={18} />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-6 py-3 font-medium flex items-center space-x-2 transition-colors ${
              activeTab === "security"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Lock size={18} />
            <span>Security</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                          <User size={48} className="text-indigo-400" />
                        </div>
                      )}
                    </div>
                    {imagePreview && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                      >
                        <X size={16} />
                      </motion.button>
                    )}
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white text-indigo-600 px-3 py-1 rounded-full shadow-md text-sm font-medium cursor-pointer flex items-center space-x-1"
                    >
                      <UploadCloud size={14} />
                      <span>Change</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </motion.label>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl font-bold text-gray-800">
                      {adminData.name}
                    </h2>
                    <p className="text-gray-600">{adminData.email}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      {adminData.address}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <User size={16} className="mr-2 text-gray-500" />
                        Full Name
                      </label>
                      <input
                        {...register("name", { required: "Name is required" })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Mail size={16} className="mr-2 text-gray-500" />
                        Email
                      </label>
                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Phone size={16} className="mr-2 text-gray-500" />
                        Phone Number
                      </label>
                      <input
                        {...register("phone", {
                          required: "Phone is required",
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <MapPin size={16} className="mr-2 text-gray-500" />
                        Address
                      </label>
                      <input
                        {...register("address", {
                          required: "Address is required",
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={tabVariants}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Change Password
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Lock size={16} className="mr-2 text-gray-500" />
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("currentPassword", {
                          required: "Current password is required",
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Lock size={16} className="mr-2 text-gray-500" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("newPassword", {
                          required: "New password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Lock size={16} className="mr-2 text-gray-500" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === watch("newPassword") ||
                            "Passwords do not match",
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Update Password</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminProfileSettings
