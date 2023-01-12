const mongoose = require('mongoose')
const cartSchema = require('./Cart')

const userSchema = new mongoose.Schema({
     name: String,
     email: String,
     password: String,
     role: {
          type: Number,
          default: 2009
     },
     cart: [cartSchema]
},{
     timestamps: true
})

module.exports = mongoose.model('User', userSchema)