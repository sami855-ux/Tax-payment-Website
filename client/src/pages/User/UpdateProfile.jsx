import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useState, useCallback } from "react"
import { X, Loader2, UploadCloud } from "lucide-react"

import { getUserById, updateUserById } from "@/services/apiUser"
import SectionWrapper from "@/ui/SectionWrapper"
import { login } from "@/redux/slice/userSlice"
import SaveButton from "@/ui/SaveButton"
import Input from "@/ui/Input"

export default function UpdateProfile() {
  const { user } = useSelector((store) => store.user)
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(user?.profilePicture || "")
  const [imageFile, setImageFile] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm()
  const dispatch = useDispatch()

  // Watch all form values

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files[0]
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          // 2MB limit
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
        setValue("profilePicture", file)
      }
    },
    [setValue]
  )

  const removeImage = useCallback(() => {
    setImagePreview("")
    setImageFile(null)
    setValue("profilePicture", null)
  }, [setValue])

  const updateUserInfo = async (data) => {
    console.log(data)

    setIsLoading(true)

    // Create FormData to handle file upload
    const formData = new FormData()
    for (const key in data) {
      if (
        data[key] !== null &&
        data[key] !== undefined &&
        key !== "profilePicture" // <-- skip it
      ) {
        formData.append(key, data[key])
      }
    }

    if (imageFile) {
      formData.append("profilePicture", imageFile)
    }

    try {
      const response = await updateUserById(formData)

      if (response.success) {
        toast.success("Profile updated successfully")

        const res = await getUserById()
        if (res.success) {
          dispatch(
            login({
              user: res.user,
            })
          )
          // Update image preview if new image was uploaded
          if (res.user.profilePicture) {
            setImagePreview(res.user.profilePicture)
          }
          reset()
        }
      } else {
        toast.error(response.error?.message || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred while updating profile")
      console.error("Update error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(updateUserInfo)}>
      <SectionWrapper title="Update Profile">
        {/* Profile Picture Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <div className="flex items-center gap-6">
            <div className="relative">
              {imagePreview ? (
                <>
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="profilePicture"
                className="cursor-pointer flex flex-col items-center justify-center px-4 py-3 bg-white rounded-md border border-dashed border-gray-300 hover:border-blue-500 transition"
              >
                <UploadCloud className="w-6 h-6 text-gray-500 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  {imageFile ? "Change Image" : "Upload Image"}
                </span>
                <span className="text-xs text-gray-500">
                  JPG, PNG or WEBP (max 2MB)
                </span>
                <input
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  className="sr-only"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <span>
            <Input
              label="Full Name"
              {...register("fullName", {
                minLength: {
                  value: 10,
                  message: "Full Name must be at least 10 letters",
                },
              })}
            />
            {errors.fullName && (
              <p className="text-[14px] text-red-400 pb-1">
                {errors.fullName.message}
              </p>
            )}
          </span>

          <span>
            <Input
              label="Email"
              type="email"
              {...register("email", {
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                  message: "Please enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-[14px] text-red-400 pb-1">
                {errors.email.message}
              </p>
            )}
          </span>

          <span>
            <Input label="Kebele" {...register("kebele", {})} />
            {errors.kebele && (
              <p className="text-[14px] text-red-400 pb-1">
                {errors.kebele.message}
              </p>
            )}
          </span>

          <span>
            <Input label="Wereda" {...register("wereda", {})} />
            {errors.wereda && (
              <p className="text-[14px] text-red-400 pb-1">
                {errors.wereda.message}
              </p>
            )}
          </span>

          <span>
            <Input
              label="Phone Number"
              type="tel"
              {...register("phoneNumber", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone Number must be 10 digits",
                },
              })}
            />
            {errors.phoneNumber && (
              <p className="text-[14px] text-red-400 pb-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </span>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <SaveButton disabled>
              <Loader2 className="animate-spin mr-2" /> Updating...
            </SaveButton>
          ) : (
            <SaveButton type="submit" disabled={isLoading}>
              Update profile
            </SaveButton>
          )}
        </div>
      </SectionWrapper>
    </form>
  )
}
