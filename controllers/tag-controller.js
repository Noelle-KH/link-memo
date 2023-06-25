const createError = require('http-errors')

const Tag = require('../models/tag-model')
const {
  formatObject,
  formatArray,
  formatMessage
} = require('../helpers/format-helpers')

const tagController = {
  getTags: async (req, res, next) => {
    try {
      const tags = await Tag.find({ userId: { $exists: false } })
        .select('name')
        .lean()

      const data = tags.length ? formatArray(tags, 'tags') : null
      const response = !data
        ? formatMessage('No data found for the tag')
        : { data }

      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  getTag: async (req, res, next) => {
    try {
      const { id } = req.params
      const tag = await Tag.findById(id).select('name').lean()
      if (!tag) {
        throw createError.NotFound('The tag does not exist')
      }

      const data = formatObject(tag, 'tags')

      res.json({ data })
    } catch (error) {
      next(error)
    }
  },
  addTag: async (req, res, next) => {
    try {
      const userId = req.id
      const { name } = req.body
      if (!name) {
        throw createError.BadRequest('Tag name is required')
      }

      const tagExist = await Tag.findOne({ name })
      if (tagExist) throw createError.BadRequest('Tag is already exist')

      const tag = await Tag.create({ name, userId })
      const data = {
        id: tag._id,
        type: 'tags',
        attributes: {
          name: tag.name
        }
      }

      res.json({ data })
    } catch (error) {
      next(error)
    }
  },
  updateTag: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params
      const { name } = req.body
      if (!name) {
        throw createError.BadRequest('Tag name is required')
      }

      const [tag, tagExist] = await Promise.all([
        Tag.findOne({ _id: id, userId }),
        Tag.findOne({ name }).select('name').lean()
      ])
      if (!tag) {
        throw createError.BadRequest('The tag does not exist')
      }

      if (tagExist && tag.name !== tagExist.name) {
        throw createError.BadRequest('Tag name already exists')
      }

      tag.name = name
      await tag.save()

      const response = formatMessage('Tag updated successfully')

      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  deleteTag: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params
      const tag = await Tag.findOneAndDelete({ _id: id, userId })
      if (!tag) {
        throw createError.NotFound('The tag does not exist')
      }

      const response = formatMessage('Tag deleted successfully')

      res.json(response)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = tagController
