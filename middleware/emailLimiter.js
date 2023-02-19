const rateLimit = require("express-rate-limit")

const emailLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 7,
  message: {
    message:
      "Too many email verification requests from this user, please try again later",
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = emailLimiter
