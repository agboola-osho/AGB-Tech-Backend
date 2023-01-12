const mongoose = require("mongoose")
const reviewsSchema = require("./Reviews")

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: {
    type: [String],
  },
  source: String,
  price: Number,
  category: String,
  brand: String,
  discount: Number,
  reviews: [reviewsSchema],
})

module.exports = mongoose.model("Product", productSchema)
