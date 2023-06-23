const createError = require('http-errors')
const { isEmail, isAlphanumeric, isByteLength, isURL } = require('validator')

const authFieldValidation = (type = 'login') => {
  return (req, res, next) => {
    const { email, password } = req.body

    if (type === 'register') {
      const { username } = req.body

      if (!username) {
        throw createError.BadRequest('All fields are required')
      }

      if (!isAlphanumeric(username)) {
        throw createError.BadRequest(
          'Username contains only letters and numbers'
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

const articleFieldValidation = (req, res, next) => {
  const { title, originUrl } = req.body

  if (!title || !originUrl) {
    throw createError.BadRequest('All fields are required')
  }

  if (!isURL(originUrl, { require_protocol: true })) {
    throw createError.BadRequest('Invalid URL')
  }

  next()
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
