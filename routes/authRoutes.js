const express = require("express")
const router = express.Router()
const emailLimiter = require("../middleware/emailLimiter")
const authController = require("../controllers/authControllers")
const verifyJWT = require("../middleware/verifyJWT")

router.post("/signup", authController.signup)

router.post("/login", authController.login)

router.get("/refresh", authController.refresh)

router.post("/logout", authController.logout)

router.post("/email", emailLimiter, authController.email)

router.patch("/verifyEmail", authController.verifyEmail)

router.patch("/resetPwd", authController.resetPassword)

router.use(verifyJWT)
router.route("/user").get(verifyJWT, authController.getUserDetails)

module.exports = router
