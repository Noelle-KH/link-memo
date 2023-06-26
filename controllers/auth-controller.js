const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const User = require('../models/user-model')
const sendEmail = require('../config/sendinblue')

const authController = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body

      const emailExist = await User.findOne({ email }).lean()
      if (emailExist) throw createError.BadRequest('Email already exists')

      const user = new User({ username, email, password })
      const savedUser = await user.save()

      const data = {
        id: savedUser._id,
        type: 'users',
        attributes: {
          username: savedUser.username,
          email: savedUser.email
        }
      }

      res.status(201).json({ data })
    } catch (error) {
      next(error)
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email }).lean()
      if (!user) throw createError.NotFound('The user does not exist')

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw createError.BadRequest('Invalid email or password')

      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: '1h'
      })

      const data = {
        id: user._id,
        type: 'users',
        attributes: {
          token
        }
      }

      res.json({ data })
    } catch (error) {
      next(error)
    }
  },
  confirmEmail: async (req, res, next) => {
    try {
      const { email } = req.body
      if (!email) {
        throw createError.BadRequest('Email is required')
      }

      const userExist = await User.findOne({ email }).select('email').lean()
      if (!userExist) {
        throw createError.BadRequest('The user does not exist')
      }

      const token = jwt.sign({ email }, process.env.RESET_SECRET, {
        expiresIn: '10m'
      })
      const url = `${req.protocol}://${req.get('host')}${req.url}/${token}`

      await sendEmail(email, url)

      res.json({
        meta: {
          message: 'Password reset email sent successfully'
        },
        data: null
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = authController
