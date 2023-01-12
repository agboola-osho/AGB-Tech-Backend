const mongoose = require('mongoose')

const reviewsSchema = new mongoose.Schema({
     sender: String,
     content: String
})

module.exports = reviewsSchema