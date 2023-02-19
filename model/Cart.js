const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
  product: { type: mongoose.SchemaTypes.ObjectId, ref: "Product" },
  quantity: Number,
})

module.exports = cartSchema
