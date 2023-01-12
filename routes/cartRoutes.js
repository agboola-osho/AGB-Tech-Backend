const express = require("express")
const router = express.Router()
const cartControllers = require("../controllers/cartControllers")
const verifyJWT = require("../middleware/verifyJWT")
const helperMiddleware = require("../middleware/helperMiddleware")

router.use(verifyJWT)

router
  .route("/")
  .get(helperMiddleware.findUserById, cartControllers.getAll)
  .post(helperMiddleware.findUserById, cartControllers.addToCart)
  .patch(helperMiddleware.findUserById, cartControllers.updateQty)
  .delete(helperMiddleware.findUserById, cartControllers.deleteFromCart)

module.exports = router
