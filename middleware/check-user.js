const createError = require('http-errors')

const User = require('../models/user-model')

const checkUserStatus = async (req, res, next) => {
  try {
    const currentTime = new Date()

    await User.deleteMany({ deletedAt: { $lt: currentTime } })

    next()
  } catch (error) {
    next(error)
  }
}

const checkUserExist = async (req, res, next) => {
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

module.exports = { checkUserStatus, checkUserExist }
