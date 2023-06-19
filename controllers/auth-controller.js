const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const jwt = require('jsonwebtoken')

const User = require('../models/user-model')

const authController = {
  register: async (req, res, next) => {
    try {
      const { username, email, password } = req.body

      const emailExist = await User.findOne({ email })
      if (emailExist) throw createError.BadRequest('Email already exists.')

      const user = new User({ username, email, password })
      const savedUser = await user.save()

      const data = { message: 'Registered successfully', id: savedUser._id }
      res.status(201).json({ data })
    } catch (error) {
      next(error)
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email })
      if (!user) throw createError.BadRequest("User doesn't exist")

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) throw createError.BadRequest('Incorrect email or password')

      const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: '1h'
      })
      const data = { message: 'Login successfully', id: user._id, token }
      res.json({ data })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = authController
