const nodemailer = require('nodemailer')
const Transport = require('nodemailer-sendinblue-transport')

const transport = nodemailer.createTransport(
  new Transport({ apiKey: process.env.SENDINBLUE_API_KEY })
)

const sendEmail = async (email, url) => {
  try {
    const info = await transport.sendMail({
      from: 'link-memo <admin@link-memo.com>',
      to: email,
      subject: 'Reset Password',
      html: `
      <h2>Reset Password Request</h2>
      <p>To reset password, please visit the following link within 10 minutes to set a new password
        <a href="${url}">
          Reset Link
        </a>
      </p>
    `
    })

    return info.messageId
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = sendEmail
