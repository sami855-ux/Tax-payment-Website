import mongoose from "mongoose"
import fs from "fs"
import dotenv from "dotenv"
import User from "../models/userModel.js"

dotenv.config()

const importData = async () => {
  try {
    await mongoose.connect(process.env.mongoURI)

    const data = JSON.parse(fs.readFileSync("./DataS/a.json", "utf-8"))
    await User.insertMany(data)

    console.log("Data Imported ✅")
    process.exit()
  } catch (error) {
    console.error("Error importing data ❌", error)
    process.exit(1)
  }
}

importData()
