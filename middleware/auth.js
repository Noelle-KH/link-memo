const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const User = require('../models/user-model')

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

const verifyResetToken = (req, res, next) => {
  try {
    const { token } = req.params
    jwt.verify(token, process.env.RESET_SECRET, (error, payload) => {
      if (error) {
        throw createError.Unauthorized('Invalid token')
      }

      req.id = payload.id

      next()
    })
  } catch (error) {
    next(error)
  }
}

const verifyDisableStatus = async (req, res, next) => {
  try {
    const currentTime = new Date()

    await User.deleteMany({ deletedAt: { $lt: currentTime } })

    next()
  } catch (error) {
    next(error)
  }
}

const verifyUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await User.findOne({ _id: id, deletedAt: null })
    if (!user) {
      throw createError.NotFound('The user does not exist')
    }

    next()
  } catch (error) {
    next(error)
  }
}

const verifyLoginUserStatus = async (req, res, next) => {
  try {
    const { id } = req
    const user = await User.findById(id).select('deletedAt').lean()
    if (user.deletedAt !== null) {
      throw createError.Forbidden('No operation permission')
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  verifyToken,
  verifyResetToken,
  verifyDisableStatus,
  verifyUserStatus,
  verifyLoginUserStatus
}
