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
    assignedOfficial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming officials are also in the User model
    },
    role: {
      type: String,
      enum: ["taxpayer", "official", "admin"],
      default: "taxpayer",
    },
    taxCategories: {
      type: [String],
      enum: ["personal", "business", "vat", "property", "other"],
    },
    isTaxSetupComplete: {
      type: Boolean,
      default: false,
    },
    taxDetails: {
      personal: {
        employmentType: String,
        monthlyIncome: Number,
        tinNumber: String,
      },
      business: {
        businessType: String,
        businessName: String,
        businessLicenseNumber: String,
        tinNumber: String,
        annualRevenueEstimate: Number,
      },
      vat: {
        registeredForVAT: Boolean,
        vatRegistrationNumber: String,
        expectedMonthlySales: Number,
      },
      property: {
        propertyType: String,
        propertyValueEstimate: Number,
        ownershipStatus: String,
      },
      other: {
        description: String,
      },
    },
    noticesSent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", UserSchema)

export default User
