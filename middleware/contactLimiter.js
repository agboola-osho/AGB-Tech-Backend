const rateLimit = require("express-rate-limit")

const contactLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 3,
  message: {
    message: "Too many requests from this user, please try again later",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = contactLimiter
