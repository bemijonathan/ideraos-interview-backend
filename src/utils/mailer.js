import nodemailer from "nodemailer"
import smtpTransport from "nodemailer-smtp-transport"
import config from "../config/secrets"
import jwt from "jsonwebtoken"
import chalk from "chalk"

const transporter = nodemailer.createTransport(smtpTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "bemijonathan",
    pass: "atieneology"
  }
}))


const sendEmail = (mailOptions, callback) => {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(chalk.blueBright(error))
      callback(false)
    } else {
      console.log("Email sent: " + info.response)
      callback(true)
    }
  })
}



export const forgotPasswordMail = async (email, token) => {
  var mailOptions = {
    from: "bemijonathan@gmail.com",
    to: email,
    subject: "RESET PASSWORD",
    text: "Click on this link to reset your password" + token
  }
  sendEmail(mailOptions, (response) => {
    console.log(chalk.yellow.bold(response, email))
    return response
  })
}

// this generates token for forgot password
export const TokenForPassword = (user) => {
  return jwt.sign({ id: user.id }, config.JWT_EMAIL, {
    expiresIn: config.JWT_EMAIL_TIME
  })
}

export const verifyEmailToken = (token) => 
  new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_EMAIL, (err, payload) => {
      if (err) return reject(err)
      resolve(payload.id)
    })
  })




