const createError = require('http-errors')
const Comment = require('../models/comment-model')

const commentController = {
  getComment: async (req, res, next) => {
    try {
      const { id } = req.params
      const comment = await Comment.findById(id)
        .select('-__v -updatedAt')
        .lean()

      res.json({ comment })
    } catch (error) {
      next(error)
    }
  },
  updateComment: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params
      const { content } = req.body
      const updatedComment = await Comment.findOneAndUpdate(
        { _id: id, userId },
        { content }
      )
      if (!updatedComment) throw createError.NotFound('Comment not found')

      res.json({
        message: 'Update comment successfully'
      })
    } catch (error) {
      next(error)
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params

      const deletedComment = await Comment.findOneAndDelete({ _id: id, userId })
      if (!deletedComment) throw createError.NotFound('Comment not found')

      res.json({
        message: 'Delete comment successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = commentController
