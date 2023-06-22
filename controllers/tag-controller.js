const createError = require('http-errors')

const Tag = require('../models/tag-model')

const tagController = {
  getTags: async (req, res, next) => {
    try {
      const tags = await Tag.find({}).select('-__v').lean()

      res.json({ tags })
    } catch (error) {
      next(error)
    }
  },
  getTag: async (req, res, next) => {
    try {
      const { id } = req.params
      const tag = await Tag.findById(id).select('-__v')
      if (!tag) throw createError.NotFound('Tag not found')

      res.json({ tag })
    } catch (error) {
      next(error)
    }
  },
  addTag: async (req, res, next) => {
    try {
      const userId = req.id
      const { name } = req.body
      if (!name) throw createError.BadRequest('Tag name is required')

      const tagExist = await Tag.findOne({ name })
      if (tagExist) throw createError.BadRequest('Tag is already exist')

      const tag = await Tag.create({ name, userId })

      res.json({
        message: 'Create tag successfully',
        tag
      })
    } catch (error) {
      next(error)
    }
  },
  updateTag: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params
      const { name } = req.body
      const tag = await Tag.findOneAndUpdate({ _id: id, userId }, { name })
      if (!tag) throw createError.NotFound('Tag not found')

      res.json({
        message: 'Update tag successfully'
      })
    } catch (error) {
      next(error)
    }
  },
  deleteTag: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params
      const tag = await Tag.findOneAndDelete({ _id: id, userId })
      if (!tag) throw createError.NotFound('Tag not found')

      res.json({
        message: 'Delete tag successfully'
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tagController
