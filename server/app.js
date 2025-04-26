import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"

import userRoutes from "./routes/user.js"
import connectDB from "./config/db.js"

const app = express()

const corsOptions = {
  origin: "http://localhost:2100",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}

app.use(cors(corsOptions))
// app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dotenv.config()

//Connect to Database
connectDB()

//Routes
app.use("/api/user", userRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () =>
  console.log(`Server is running: http://localhost/${PORT}`)
)
