const User = require("../model/User")
const Product = require("../model/Product")

// These middleware are just functions I use in many route so I decided to be a bit drier

const findUserById = async (req, res, next) => {
  const userId = req.userId
  const foundUser = await User.findById(userId)
  req.user = foundUser
  req.cart = foundUser.cart
  next()
}

const findProductById = async (req, res, next) => {
  const productId = req.body.productId
    ? req.body.productId
    : req.params.productId
  if (!productId) return res.status(400).json({ message: "id is required" })
  const product = await Product.findById(productId)
  if (!product)
    return res.status(400).json({ message: "No product with that id found" })
  req.product = product
  next()
}

const findReviewById = (req, res, next) => {
  const { reviewId } = req.body
  if (!reviewId) return res.status(400)
  req.selectedReview = req.product.reviews.id(reviewId)
  next()
}

module.exports = {
  findUserById,
  findProductById,
  findReviewById,
}
