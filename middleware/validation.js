const createError = require('http-errors')
const { isEmail, isAlphanumeric, isByteLength, isURL } = require('validator')

const userFieldValidation = (type = 'login') => {
  return (req, res, next) => {
    const { username, email } = req.body
    if (!email) {
      throw createError.BadRequest('All fields are required')
    }

    if (!isEmail(email)) {
      throw createError.BadRequest('Invalid Email')
    }

    if (type !== 'login' && type !== 'reset') {
      if (!username) {
        throw createError.BadRequest('All fields are required')
      }

      if (!isAlphanumeric(username)) {
        throw createError.BadRequest(
          'Username contains only letters and numbers'
        )
      }
    }

    next()
  }
}

const passwordFieldValidation = (type = 'login') => {
  return (req, res, next) => {
    const { password, confirmPassword } = req.body

    if (!password) {
      throw createError.BadRequest('All fields are required')
    }

    if (!isAlphanumeric(password) || !isByteLength(password, { min: 6 })) {
      throw createError.BadRequest(
        'Password length at least 6, contains only letters and numbers'
      )
    }

    if (type !== 'login') {
      if (!confirmPassword) {
        throw createError.BadRequest('All fields are required')
      }

      if (password !== confirmPassword) {
        throw createError.BadRequest(
          'Password and confirm password do not match'
        )
      }
    }

    next()
  }
}

const articleFieldValidation = (type = 'create') => {
  return (req, res, next) => {
    const { title, originUrl } = req.body

    if (type === 'update') {
      const { summary, record, tagsId } = req.body
      if (!title || !summary || !record || !tagsId.length) {
        throw createError.BadRequest('All fields are required ')
      }

      return next()
    }

    if (!title || !originUrl) {
      throw createError.BadRequest('All fields are required')
    }

    if (!isURL(originUrl, { require_protocol: true })) {
      throw createError.BadRequest('Invalid URL')
    }

    next()
  }
}

module.exports = {
  userFieldValidation,
  articleFieldValidation,
  passwordFieldValidation
}
