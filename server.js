const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("express-async-errors")
require("dotenv").config()
const errorHandler = require("./middleware/errorHandler")
const PORT = process.env.PORT || 3500
const app = express()
const connectDB = require("./config/dbConn")
const corsOptions = require("./config/corsOptions")

connectDB()

app.use(errorHandler)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use("/products", require("./routes/productRoutes"))
app.use("/products/reviews", require("./routes/reviewsRoutes"))
app.use("/auth", require("./routes/authRoutes"))
app.use("/cart", require("./routes/cartRoutes"))
app.use("/contact", require("./routes/contactRoutes"))

mongoose.connection.on("error", (err) => {
  console.log(err)
})
mongoose.connection.once("open", () => {
  console.log("connected to mongo db")
  app.listen(PORT, () => console.log(`Server running on ${PORT}`))
})
