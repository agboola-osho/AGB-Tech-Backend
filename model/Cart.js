const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
  title: String,
  image: String,
  quantity: Number,
  price: Number,
  source: String,
})

module.exports = cartSchema
