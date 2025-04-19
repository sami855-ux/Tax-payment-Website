import express from "express"
import dotenv from "dotenv"
import crypto from "crypto"

import userRoutes from "./routes/user.js"
import connectDB from "./config/db.js"

dotenv.config()

const PORT = process.env.PORT || 5000
const secret = crypto.randomBytes(64).toString("hex")

//Connect to Database
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes
app.use("/user", userRoutes)

app.listen(PORT, () =>
  console.log(`Server is running: http://localhost/${PORT}`)
)
