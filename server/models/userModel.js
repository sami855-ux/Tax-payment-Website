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
      enum: ["Male", "Female", "Other"],
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
    emailAddress: {
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
      type: String, // This can be a URL or file path
      default: null, // Optional field
    },
    role: {
      type: String,
      enum: ["taxpayer", "admin"], // Only allows these two roles
      default: "taxpayer", // Default role is taxpayer
    },
  },
  { timestamps: true }
)

const user = mongoose.model("user", UserSchema)

export default user
