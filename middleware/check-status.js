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

module.exports = checkUserStatus
