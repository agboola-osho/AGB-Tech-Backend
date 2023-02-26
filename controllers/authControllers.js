const User = require("../model/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const emailHTML = require("../config/authEmailHtml")
const frontend = require("../config/frontend")

const signup = async (req, res) => {
  const { name, email, password } = req.body
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
  await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  })
  return res.status(201).json({ message: "Verify Your Email" })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" })
  }
  const foundUser = await User.findOne({ email }).exec()
  if (!foundUser) {
    return res.status(401).json({ message: "Incorrect Email or Password" })
  }

  if (foundUser.verified === false) {
    return res.status(401).json({ message: "Verify Your email" })
  }

  const match = await bcrypt.compare(password, foundUser.password)
  if (!match) {
    return res.status(401).json({ message: "Incorrect Email or Passsword" })
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
  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Please Login Again" })
  }
  const refreshToken = cookies.jwt
  try {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
  const foundUser = await User.findById(decoded.user).lean().exec()
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
    res.status(200).json({ accessToken })
} catch (err) {
  return res.status(401).json({ message: "Please Login Again" })
}
}

const email = async (req, res) => {
  const { btnContent, message1, message2, title, header, email, operation } =
    req.body
  const foundUser = await User.findOne({ email }).select("name")
  if (!foundUser)
    return res
      .status(400)
      .json({ message: "No user with that email was found" })
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  })

  jwt.sign(
    {
      email,
    },
    process.env.EMAIL_TOKEN_SECRET,
    {
      expiresIn: "15m",
    },
    (err, encoded) => {
      transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: header,
        html: emailHTML(
          foundUser.name,
          title,
          header,
          message1,
          message2,
          btnContent,
          `${frontend}/${operation}?token=${encoded}`
        ),
      })
    }
  )
  res.status(200).json({ message: "Email sent" })
}

const verifyEmail = async (req, res) => {
  const token = req.body.token
  jwt.verify(token, process.env.EMAIL_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token expired" })
    }
    const foundUser = await User.findOne({ email: decoded.email })
    await foundUser.updateOne({ verified: true })
    res.status(200).json({ message: "User verified" })
  })
}

const resetPassword = async (req, res) => {
  const { password, token } = req.body
  jwt.verify(token, process.env.EMAIL_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: "Link expired" })
    const email = decoded.email
    const newPassword = await bcrypt.hash(password, 10)
    const foundUser = await User.findOne({ email })
    await foundUser.updateOne({ password: newPassword })
    res.status(200).json({ message: "Password updated" })
  })
}

const getUserDetails = async (req, res) => {
  const id = req.userId
  if (!id) return res.sendStatus(400)
  const foundUser = await User.findById(id).select(
    "-password -role -verified -cart"
  )
  res.status(200).json(foundUser)
}

module.exports = {
  signup,
  login,
  logout,
  refresh,
  email,
  verifyEmail,
  resetPassword,
  getUserDetails,
}
