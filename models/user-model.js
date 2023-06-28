const bcrypt = require('bcryptjs')
const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
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
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next()
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.pre('deleteMany', async function (next) {
  try {
    const deletedUsers = await this.model.find(this.getFilter())

    if (deletedUsers.length) {
      const deleteDocument = deletedUsers.map((user) => {
        const userId = user._id

        return Promise.all([
          this.model('Article').deleteMany(userId),
          this.model('Comment').deleteMany(userId),
          this.model('Tag').deleteMany(userId),
          this.model('Follow').deleteMany(userId),
          this.model('Bookmark').deleteMany(userId)
        ])
      })

      await Promise.all(deleteDocument)

      next()
    }
  } catch (error) {
    next(error)
  }
})

userSchema.virtual('articleCount', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'userId',
  count: true
})

userSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'userId',
  count: true
})

userSchema.virtual('followerCount', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'followerId',
  count: true
})

userSchema.virtual('followingCount', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'followingId',
  count: true
})

userSchema.virtual('bookmarkCount', {
  ref: 'Bookmark',
  localField: '_id',
  foreignField: 'userId',
  count: true
})

module.exports = model('User', userSchema)
