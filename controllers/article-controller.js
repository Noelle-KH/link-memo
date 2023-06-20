const createError = require('http-errors')

const Article = require('../models/article-model')
const Comment = require('../models/comment-model')
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
  },
  getArticleComments: async (req, res, next) => {
    try {
      const articleId = req.params.id

      const comments = await Comment.find({ articleId })
        .select('-__v -updatedAt')
        .lean()

      res.json({ comments })
    } catch (error) {
      next(error)
    }
  },
  addArticleComment: async (req, res, next) => {
    try {
      const userId = req.id
      const articleId = req.params.id
      const { content } = req.body
      if (!content) throw createError.BadRequest('All fields are required')

      const article = await Article.findById(articleId).lean()
      if (!article) throw createError.NotFound('Article not found')

      const comment = await Comment.create({ userId, articleId, content })

      res.json({
        message: 'Create comment successfully',
        comment
      })
    } catch (error) {
      next(error)
    }
  },
  goToOriginUrl: async (req, res, next) => {
    try {
      const { shortenUrl } = req.params

      const article = await Article.findOne({
        'urls.shortenUrl': shortenUrl
      })
        .select('urls.originUrl')
        .lean()
      if (!article) throw createError.NotFound('Url not found')

      const { originUrl } = article.urls

      res.redirect(originUrl)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = articleController
