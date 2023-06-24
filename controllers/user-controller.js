const createError = require('http-errors')

const Article = require('../models/article-model')
const User = require('../models/user-model')
const Comment = require('../models/comment-model')
const Follow = require('../models/follow-model')
const {
  formatObject,
  formatArray,
  formatMessage
} = require('../helpers/format-helpers')

const userController = {
  getUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const user = await User.findById(id)
        .populate([
          'articleCount',
          'commentCount',
          'followerCount',
          'followingCount'
        ])
        .select('username email')
        .lean()
      if (!user) {
        throw createError.NotFound('The user does not exist')
      }

      const data = formatObject(user, 'users')

      res.json({ data })
    } catch (error) {
      next(error)
    }
  },
  updateUser: async (req, res, next) => {
    try {
      const { id } = req.params
      const { file } = req
      const { username, email, password } = req.body

      const [user, foundEmail] = await Promise.all([
        User.findById(id),
        User.findOne({ email }).select('email').lean()
      ])
      if (foundEmail && user.email !== foundEmail.email) {
        throw createError.BadRequest('Email already exists')
      }

      const avatar = file.path || user.avatar

      Object.assign(user, { username, email, password, avatar })
      await user.save()

      const response = formatMessage('User updated successfully')

      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  getUserArticles: async (req, res, next) => {
    try {
      const { id } = req.params
      const articles = await Article.find({ userId: id })
        .populate('articleCommentCount')
        .select('title summary record urls')
        .lean()

      const data = articles.length ? formatArray(articles, 'articles') : null
      const response = !data
        ? formatMessage('No data found for the article')
        : { data }

      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  getUserComments: async (req, res, next) => {
    try {
      const { id } = req.params
      const comments = await Comment.find({ userId: id })
        .select('content')
        .lean()

      const data = comments.length ? formatArray(comments, 'comments') : null
      const response = !data
        ? formatMessage('No data found for the comment')
        : { data }

      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowers: async (req, res, next) => {
    try {
      const { id } = req.params
      const followShip = await Follow.find({
        followingId: id
      })
        .select('followerId')
        .lean()

      const data = followShip.length ? formatArray(followShip, 'follows') : null
      const response = !data
        ? formatMessage('No data found for the follower')
        : { data }

      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  getUserFollowings: async (req, res, next) => {
    try {
      const { id } = req.params
      const followShip = await Follow.find({ followerId: id })
        .select('followingId')
        .lean()

      const data = followShip.length ? formatArray(followShip, 'follows') : null
      const response = !data
        ? formatMessage('No data found for the following')
        : { data }

      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  postUserFollow: async (req, res, next) => {
    try {
      const followerId = req.id
      const followingId = req.params.id

      if (followerId === followingId) {
        throw createError.BadRequest('Cannot follow yourself')
      }

      const followExist = await Follow.findOne({ followerId, followingId })
      if (followExist) {
        throw createError.BadRequest('You are already following this user')
      }

      await Follow.create({ followerId, followingId })

      const response = formatMessage(
        'Following relationship created successfully'
      )

      res.json(response)
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

      const response = formatMessage(
        'Following relationship deleted successfully'
      )

      res.json(response)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
