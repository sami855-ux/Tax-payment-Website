import cookieParser from "cookie-parser"
import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"

import notificationRoute from "./routes/Notification.route.js"
import taxScheduleRoutes from "./routes/TaxSchedule.route.js"
import taxFillingRoutes from "./routes/taxFilling.route.js"
import sendEmailRoute from "./routes/sendEmail.route.js"
import paymentRoutes from "./routes/taxPayment.route.js"
import { getMe } from "./controller/user.controller.js"
import taxRuleRoutes from "./routes/TaxRule.route.js"
import exportRoutes from "./routes/export.route.js"
import backupRoutes from "./routes/backup.route.js"
import userRoutes from "./routes/user.route.js"
import connectDB from "./config/db.js"

const app = express()

const allowedOrigin = [
  "https://tax-payment-website.vercel.app",
  "http://localhost:2100",
]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigin.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}

app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

dotenv.config()

//Connect to Database
connectDB()

//Routes
app.get("/api/auth", getMe)
app.use("/api/user", userRoutes)
app.use("/api/rule", taxRuleRoutes)
app.use("/api/export", exportRoutes)
app.use("/api/backup", backupRoutes)
app.use("/api/email", sendEmailRoute)
app.use("/api/payment", paymentRoutes)
app.use("/api/filling", taxFillingRoutes)
app.use("/api/schedule", taxScheduleRoutes)
app.use("/api/notifications", notificationRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(`Server is running: http://localhost/${PORT}`)
)
