const express = require("express")
const router = express.Router()
const verifyJWT = require("../middleware/verifyJWT")
const helperMiddleware = require("../middleware/helperMiddleware")
const reviewControllers = require("../controllers/reviewsControllers")

router
  .route("/")
  .post(
    verifyJWT,
    helperMiddleware.findUserById,
    helperMiddleware.findProductById,
    reviewControllers.addReview
  )
  .patch(
    verifyJWT,
    helperMiddleware.findUserById,
    helperMiddleware.findProductById,
    helperMiddleware.findReviewById,
    reviewControllers.editReview
  )
  .delete(
    verifyJWT,
    helperMiddleware.findUserById,
    helperMiddleware.findProductById,
    helperMiddleware.findReviewById,
    reviewControllers.deleteReview
  )

router.get(
  "/:productId",
  helperMiddleware.findProductById,
  reviewControllers.getReviews
)

module.exports = router
