const createError = require('http-errors')

const Article = require('../models/article-model')
const User = require('../models/user-model')
const Comment = require('../models/comment-model')

const userController = {
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findById(id).select('-__v -updatedAt').lean()
      if (!user) {
        throw createError.NotFound('User not found')
      }

      res.json({ user })
    } catch (error) {
      next(error)
    }
  },
  getUserArticles: async (req, res, next) => {
    try {
      const { id } = req.params
      const articles = await Article.find({ userId: id })
        .select('-__v -updatedAt')
        .lean()

      res.json({ articles })
    } catch (error) {
      next(error)
    }
  },
  getUserComments: async (req, res, next) => {
    try {
      const { id } = req.params
      const comments = await Comment.find({ userId: id })
        .select('-__v -updatedAt')
        .lean()

      res.json({ comments })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
