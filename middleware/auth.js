const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      throw createError.Unauthorized('Please login or register an account')
    }

    const token = authorization.split(' ')[1]
    jwt.verify(token, process.env.SECRET, (error, payload) => {
      if (error) {
        throw createError.Unauthorized('Please login or register an account')
      }

      req.id = payload.id
      next()
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { verifyToken }
