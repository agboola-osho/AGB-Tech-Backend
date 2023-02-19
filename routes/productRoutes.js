const express = require("express")
const router = express.Router()
const productController = require("../controllers/productsControllers")
const verifyJWT = require("../middleware/verifyJWT")
const verifyRoles = require("../middleware/verifyRoles")
const ROLES_LIST = require("../config/roles_list")

router
  .route("/")
  .post(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    productController.createNewProduct
  )
  .delete(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    productController.deleteProduct
  )
  .patch(
    verifyJWT,
    verifyRoles(ROLES_LIST.Admin),
    productController.updateProduct
  )
  .get(productController.getAllProducts)

router.get("/categories", productController.getProductCategories)
router.get("/brands", productController.getProductBrands)
router.get("/categories/:category", productController.getProductByCategory)
router.get("/brands/:brand", productController.getProductByBrand)
router.get("/search", productController.searchProducts)

module.exports = router
