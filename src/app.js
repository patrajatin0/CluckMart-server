import dotenv from "dotenv"
dotenv.config({ path: "./.env" })
import express from "express"
import cookieparser from "cookie-parser"
import cors from "cors"
import connectDB from "./config/database.js"
import AuthRoters from "./routes/authRoutes.js"
import ProductRouter from "./routes/ProductRoutes.js"
import OrderRouter from "./routes/orderRoutes.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(cookieparser())
app.use(cors({ origin: "", credentials: true }))

const PORT = process.env.PORT

app.use("/api/auth", AuthRoters)
app.use("/api", ProductRouter)
app.use("/api", OrderRouter)

connectDB().then(() => {
    console.log("connection established")
    app.listen(PORT, () => {
        console.log(`The server is listening on http://localhost:${PORT}`)
    })
})
    .catch((err) => {
        console.error(err)
    })



