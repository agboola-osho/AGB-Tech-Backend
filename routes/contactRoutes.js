const express = require("express")
const router = express.Router()
const contact = require("../controllers/contactControllers")
const contactLimiter = require("../middleware/contactLimiter")

router.post("/", contactLimiter, contact)

module.exports = router
