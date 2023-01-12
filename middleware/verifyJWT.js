const jwt = require("jsonwebtoken")

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Please login to continue shopping" })
  }

  const token = authHeader.split(" ")[1]

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.role = decoded.UserInfo.role
    req.userId = decoded.UserInfo.user
    next()
  })
}

module.exports = verifyJWT
