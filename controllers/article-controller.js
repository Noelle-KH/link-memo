const createError = require('http-errors')

const Article = require('../models/article-model')
const {
  generateShortenUrl,
  generateQRCode,
  generateSummary
} = require('../helpers/article-helpers')

const articleController = {
  getArticles: async (req, res, next) => {
    try {
      const articles = await Article.find({}).select('-__v -updatedAt').lean()

      res.json({ articles })
    } catch (error) {
      next(error)
    }
  },
  getArticle: async (req, res, next) => {
    try {
      const { id } = req.params

      const article = await Article.findById(id)
        .select('-__v -updatedAt')
        .lean()
      if (!article) throw createError.NotFound('Article not found')

      res.json({ article })
    } catch (error) {
      next(error)
    }
  },
  addArticle: async (req, res, next) => {
    try {
      const userId = req.id
      const { title, originUrl } = req.body

      const shortenUrl = generateShortenUrl()
      const qrCode = await generateQRCode(originUrl)
      const summary = await generateSummary(originUrl)

      const article = new Article({
        title,
        urls: {
          originUrl,
          shortenUrl,
          qrCode
        },
        summary,
        userId
      })
      const savedArticle = await article.save()

      res.json({
        message: 'Create article successfully',
        article: savedArticle
      })
    } catch (error) {
      next(error)
    }
  },
  updateArticle: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params
      const { title, summary, record, tagsId } = req.body
      if (!title || !summary) {
        throw createError.BadRequest('Title and summary are required')
      }

      const updatedArticle = await Article.findOneAndUpdate(
        { _id: id, userId },
        { title, summary, record, tagsId }
      )
      if (!updatedArticle) {
        throw createError.NotFound('Article not found')
      }

      res.json({ message: 'Update article successfully' })
    } catch (error) {
      next(error)
    }
  },
  deleteArticle: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params

      const deleteArticle = await Article.findOneAndDelete({ _id: id, userId })
      if (!deleteArticle) {
        throw createError.NotFound('Article not found')
      }

      res.json({ message: 'Delete article successfully' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = articleController
