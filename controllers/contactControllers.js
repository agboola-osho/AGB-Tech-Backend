const nodemailer = require("nodemailer")
const emailHtml = require("../config/contactEmailHtml")

const contact = (req, res) => {
  const { email, name, message } = req.body
  const html = emailHtml(name)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  })
  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Contact Us",
    html,
  })
  transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "You have been contact",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  })
  res.status(200).json({ message: "Thank you for contacting us" })
}

module.exports = contact
