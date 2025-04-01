import express from "express"
import dotenv from "dotenv"

const app = express()

dotenv.config()

const PORT = process.env.PORT || 5000

app.listen(() => console.log(`Server is running: http://localhost/${PORT}`))
