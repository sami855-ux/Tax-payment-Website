import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    taxId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    residentialAddress: {
      type: String,
      required: true,
      trim: true,
    },
    kebele: {
      type: String,
      required: true,
    },
    wereda: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["taxpayer", "official", "admin"],
      default: "taxpayer",
    },
  },
  { timestamps: true }
)

const user = mongoose.model("user", UserSchema)

export default user
