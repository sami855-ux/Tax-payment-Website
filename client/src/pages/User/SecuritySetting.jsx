import toast from "react-hot-toast"

import { updateUserById } from "@/services/apiUser"
import SectionWrapper from "@/ui/SectionWrapper"
import { useForm } from "react-hook-form"
import SaveButton from "@/ui/SaveButton"
import Input from "@/ui/Input"

export default function SecuritySetting() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm()

  const onSubmit = async (data) => {
    console.log(data)
    const response = await updateUserById({
      password: data.password,
    })
    if (response.success) {
      toast.success("Password updated successfully")
    } else {
      toast.error("Failed to update password")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SectionWrapper title="Security Settings">
        <span>
          <Input
            label="New Password"
            type="password"
            {...register("password", {
              required: "password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            placeholder={"********"}
          />
          {errors.password && (
            <p className="text-[14px] text-red-400 pb-1">
              {errors.password.message}
            </p>
          )}
        </span>

        <span>
          <Input
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", {
              required: "confirm password is required",
              validate: (value) => {
                if (value !== watch("password")) {
                  return "Passwords do not match"
                }
              },
            })}
            placeholder={"********"}
          />
          {errors.confirmPassword && (
            <p className="text-[14px] text-red-400 pb-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </span>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            className="w-5 h-5 rounded cursor-pointer text-indigo-600 outline-none focus:ring-2"
          />
          <label className="text-gray-700 text-sm">
            Enable Two-Factor Authentication (2FA)
          </label>
        </div>
        <SaveButton>Change password</SaveButton>
      </SectionWrapper>
    </form>
  )
}
