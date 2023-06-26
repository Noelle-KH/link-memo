const SibApiV3Sdk = require('sib-api-v3-sdk')
const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey = process.env.SENDINBLUE_API_KEY

const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi()
const sender = { email: 'admin@link-memo.com', name: 'link-memo' }

const sendEmail = async (email, url) => {
  try {
    const info = await transEmailApi.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: 'Reset Password',
      htmlContent: `
        <h2>Reset Password Request</h2>
        <p>To reset password, please visit the following link within 10 minutes to set a new password
          <a href="${url}">
            Reset Link
          </a>
        </p>
      `
    })

    return info
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = sendEmail
