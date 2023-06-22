const createError = require('http-errors')

const Article = require('../models/article-model')
const User = require('../models/user-model')
const Comment = require('../models/comment-model')
const Follow = require('../models/follow-model')

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
  updateUser: (req, res, next) => {},
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
  },
  getUserFollows: async (req, res, next) => {
    try {
      const { id } = req.params
      const followShip = await Follow.find({
        $or: [{ followerId: id }, { followingId: id }]
      })
        .select('-__v')
        .lean()

      res.json({ followShip })
    } catch (error) {
      next(error)
    }
  },
  postUserFollow: async (req, res, next) => {
    try {
      const followerId = req.id
      const followingId = req.params.id
      console.log(followerId === followingId)
      if (followerId === followingId) {
        throw createError.BadRequest('Cannot follow yourself')
      }

      const followExist = await Follow.findOne({ followerId, followingId })
      if (followExist) {
        throw createError.BadRequest('You are already following this user')
      }

      await Follow.create({ followerId, followingId })

      res.json({
        message: 'Create new following relationship successfully'
      })
    } catch (error) {
      next(error)
    }
  },
  deleteUserFollow: async (req, res, next) => {
    try {
      const followerId = req.id
      const followingId = req.params.id
      if (followerId === followingId) {
        throw createError.BadRequest('Cannot follow yourself')
      }

      const followExist = await Follow.findOneAndDelete({
        followerId,
        followingId
      })
      if (!followExist) {
        throw createError.BadRequest('You are not following this user')
      }

      res.json({
        message: 'Delete following relationship successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
