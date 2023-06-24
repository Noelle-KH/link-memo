const createError = require('http-errors')

const Comment = require('../models/comment-model')
const { formatObject, formatMessage } = require('../helpers/format-helpers')

const commentController = {
  getComment: async (req, res, next) => {
    try {
      const { id } = req.params
      const comment = await Comment.findById(id).select('content').lean()
      if (!comment) throw createError.NotFound('The comment does not exist')

      const data = formatObject(comment, 'comments')

      res.json({ data })
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
      if (!updatedComment) {
        throw createError.NotFound('The comment does not exist')
      }

      const response = formatMessage('Comment updated successfully')

      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params

      const deletedComment = await Comment.findOneAndDelete({ _id: id, userId })
      if (!deletedComment) {
        throw createError.NotFound('The comment does not exist')
      }

      const response = formatMessage('Comment deleted successfully')

      res.json(response)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = commentController
