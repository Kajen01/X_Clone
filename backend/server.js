import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/users.route.js"
import connectDB from "./db/connectDB.js"

dotenv.config()
const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)


app.listen(PORT, () => {
    console.log(`Server is running on port number: ${PORT}`)
    connectDB()
})