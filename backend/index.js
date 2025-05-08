import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"
import clientRoutes from "./routes/clientsRoutes.js"
import invoicesRoutes from "./routes/invoicesRoutes.js"

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

// connect to mongodb
connectDB()

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.json())

// home route
app.get("/", (req, res) => {
  res.send("Invoice Manager Dashboard")
})

// client routes
app.use("/", clientRoutes)

// invoice routes
app.use("/", invoicesRoutes)

app.listen(port, () => {
  console.log(`Server running on: http://localhost:${port}`)
})
