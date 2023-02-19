const mongoose = require("mongoose")

const reviewsSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
    content: String,
  },
  {
    timestamps: true,
  }
)

module.exports = reviewsSchema
