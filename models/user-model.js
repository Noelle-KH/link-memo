const bcrypt = require('bcryptjs')
const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default:
      'https://res.cloudinary.com/dcgkzdjtr/image/upload/v1687157291/human_coding_og7byy.png'
  }
})

userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})

module.exports = model('User', userSchema)
