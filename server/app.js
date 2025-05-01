import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import cookieParser from "cookie-parser"

import sendEmailRoute from "./routes/sendEmail.js"
import exportRoutes from "./routes/export.js"
import userRoutes from "./routes/user.js"
import connectDB from "./config/db.js"

const app = express()

const corsOptions = {
  origin: "http://localhost:2100",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

dotenv.config()

//Connect to Database
connectDB()

//Routes
app.use("/api/user", userRoutes)
app.use("/api/export", exportRoutes)
app.use("/api/email", sendEmailRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(`Server is running: http://localhost/${PORT}`)
)
