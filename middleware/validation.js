const createError = require('http-errors')
const { isEmail, isAlphanumeric, isByteLength, isURL } = require('validator')

const authFieldValidation = (type = 'login') => {
  return (req, res, next) => {
    const { email, password } = req.body

    if (type === 'register') {
      const { username, confirmPassword } = req.body

      if (!username || !confirmPassword) {
        throw createError.BadRequest('All fields are required')
      }

      if (!isAlphanumeric(username)) {
        throw createError.BadRequest(
          'Username contains only letters and numbers'
        )
      }

      if (password !== confirmPassword) {
        throw createError.BadRequest(
          'Password and confirm password do not match'
        )
      }
    }

    if (!email || !password) {
      throw createError.BadRequest('All fields are required')
    }

    if (!isEmail(email)) {
      throw createError.BadRequest('Invalid Email')
    }

    if (!isAlphanumeric(password) || !isByteLength(password, { min: 6 })) {
      throw createError.BadRequest(
        'Password length at least 6, contains only letters and numbers'
      )
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

const userFieldValidation = (req, res, next) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    throw createError.BadRequest('All fields are required')
  }

  if (!isEmail(email)) {
    throw createError.BadRequest('Invalid Email')
  }

  if (!isAlphanumeric(password) || !isByteLength(password, { min: 6 })) {
    throw createError.BadRequest(
      'Password length at least 6, contains only letters and numbers'
    )
  }

  next()
}

module.exports = {
  authFieldValidation,
  articleFieldValidation,
  userFieldValidation
}
