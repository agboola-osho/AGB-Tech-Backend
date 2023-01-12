const mongoose = require('mongoose')

const connectDB = () => {
     mongoose.connect(process.env.DATABASE_URI)
}

module.exports = connectDB