const User = require("../model/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const signup = async (req, res) => {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }
  const duplicate = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec()
  if (duplicate) {
    return res
      .status(409)
      .json({ message: "User with that email already exists" })
  }
  let newUser
  if (role) {
    newUser = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
    })
  } else if (!role) {
    newUser = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
    })
  }
  const accessToken = jwt.sign(
    {
      UserInfo: {
        name: newUser.name,
        user: newUser._id,
        role: newUser.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  )
  const refreshToken = jwt.sign(
    {
      user: newUser._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  res.json({ accessToken })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }
  const foundUser = await User.findOne({ email }).exec()
  if (!foundUser) {
    return res.status(401).json({ message: "Incorrect Email" })
  }
  const match = await bcrypt.compare(password, foundUser.password)
  if (!match) {
    return res.status(401).json({ message: "Incorrect Passsword" })
  }
  const accessToken = jwt.sign(
    {
      UserInfo: {
        user: foundUser._id,
        role: foundUser.role,
        name: foundUser.name,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  )
  const refreshToken = jwt.sign(
    {
      user: foundUser._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  )
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })
  res.json({ accessToken })
}

const logout = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
  res.status(200).json({ message: "logged out" })
}

const refresh = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt)
    return res.status(401).json({ message: "Please Login Again" })

  const refreshToken = cookies.jwt
    const decoded = await jwt.verifyAsync(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const foundUser = await User.findById(decoded.user).exec()

    if (!foundUser) {
      return res.status(401).json({ message: "Please Login Again" })
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          user: foundUser._id,
          role: foundUser.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    )

    res.json({ accessToken })
}

module.exports = {
  signup,
  login,
  logout,
  refresh,
}
