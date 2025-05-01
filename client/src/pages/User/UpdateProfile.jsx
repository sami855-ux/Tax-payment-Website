import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useState } from "react"

import { getUserById, updateUserById } from "@/services/apiUser"
import SectionWrapper from "@/ui/SectionWrapper"
import { login } from "@/redux/slice/userSlice"
import SaveButton from "@/ui/SaveButton"
import { Loader2 } from "lucide-react"
import Input from "@/ui/Input"

export default function UpdateProfile() {
  const { user } = useSelector((store) => store.user)
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const dispatch = useDispatch()

  const updateUserInfo = async (data) => {
    console.log(data)
    setIsLoading(true)

    const response = await updateUserById(data)

    if (response.success) {
      toast.success("Profile updated successfully")

      const res = await getUserById()

      if (res.success) {
        dispatch(
          login({
            user: res.user,
          })
        )
      }
    } else if (!response.success) {
      toast.error(response.error.message)
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(updateUserInfo)}>
      <SectionWrapper title="Update Profile">
        <span className="">
          <Input
            label="Full Name"
            placeholder={user?.fullName}
            {...register("fullName", {
              required: "Full Name is required",
              minLength: {
                value: 10,
                message: "Full Name must a at least 10 letters",
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
            placeholder={user?.email}
            {...register("email", {
              required: "Email is required",
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
          <Input
            label="Kebele"
            placeholder={user?.kebele}
            {...register("kebele", { required: "Kebele is required" })}
          />
          {errors.kebele && (
            <p className="text-[14px] text-red-400 pb-1">
              {errors.kebele.message}
            </p>
          )}
        </span>

        <span>
          <Input
            label="Wereda"
            placeholder={user?.wereda}
            {...register("wereda", { required: "Wereda is required" })}
          />
          {errors.wereda && (
            <p className="text-[14px] text-red-400 pb-1">
              {errors.wereda.message}
            </p>
          )}
        </span>

        <span>
          <Input
            label=" ResidentialAddress"
            placeholder={user?.residentialAddress}
            {...register("residentialAddress", {
              required: "Residential Address is required",
              minLength: {
                value: 10,
                message: "Full Name must a at least 10 letters",
              },
            })}
          />
          {errors.residentialAddress && (
            <p className="text-[14px] text-red-400 pb-1">
              {errors.residentialAddress.message}
            </p>
          )}
        </span>

        <span>
          <Input
            label="Phone Number"
            placeholder={user?.phoneNumber}
            type="tel"
            {...register("phoneNumber", {
              required: "Phone Number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Phone Number must be 10 digits",
              },
              maxLength: {
                value: 10,
                message: "Phone Number must be 10 digits",
              },
              minLength: {
                value: 10,
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
        {isLoading ? (
          <SaveButton>
            {" "}
            <Loader2 className="animate-spin" /> Updating...
          </SaveButton>
        ) : (
          <SaveButton> Update profile</SaveButton>
        )}
      </SectionWrapper>
    </form>
  )
}
