const createError = require('http-errors')

const Article = require('../models/article-model')
const Comment = require('../models/comment-model')
const {
  generateShortenUrl,
  generateQRCode,
  generateSummary
} = require('../helpers/article-helpers')
const {
  formatObject,
  formatArray,
  formatMessage
} = require('../helpers/format-helpers')

const articleController = {
  getArticles: async (req, res, next) => {
    try {
      const articles = await Article.find({})
        .populate('articleCommentCount')
        .select('title summary record urls tagsId')
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
  getArticle: async (req, res, next) => {
    try {
      const { id } = req.params

      const article = await Article.findById(id)
        .populate('articleCommentCount')
        .select('title summary record urls tagsId')
        .lean()
      if (!article) {
        throw createError.NotFound('The article does not exist')
      }

      const data = formatObject(article, 'articles')

      res.json({ data })
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

      const data = {
        id: savedArticle._id,
        type: 'articles',
        attributes: {
          title: savedArticle.title,
          summary: savedArticle.summary,
          urls: savedArticle.urls
        }
      }

      res.json({ data })
    } catch (error) {
      next(error)
    }
  },
  updateArticle: async (req, res, next) => {
    try {
      const userId = req.id
      const { id } = req.params
      const { title, summary, record, tagsId } = req.body

      const updatedArticle = await Article.findOneAndUpdate(
        { _id: id, userId },
        { title, summary, record, tagsId }
      )
      if (!updatedArticle) {
        throw createError.NotFound('The article does not exist')
      }

      const response = formatMessage('Article updated successfully')

      res.json(response)
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
        throw createError.NotFound('The article does not exist')
      }

      const response = formatMessage('Article deleted successfully')

      res.json(response)
    } catch (error) {
      next(error)
    }
  },
  getArticleComments: async (req, res, next) => {
    try {
      const articleId = req.params.id

      const comments = await Comment.find({ articleId })
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
  addArticleComment: async (req, res, next) => {
    try {
      const userId = req.id
      const articleId = req.params.id
      const { content } = req.body
      if (!content) {
        throw createError.BadRequest('All fields are required')
      }

      const article = await Article.findById(articleId).lean()
      if (!article) {
        throw createError.NotFound('The article does not exist')
      }

      const comment = await Comment.create({ userId, articleId, content })

      const data = {
        id: comment.id,
        type: 'comments',
        attributes: {
          content: comment.content
        }
      }

      res.json({ data })
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
      if (!article) {
        throw createError.NotFound('The URL does not exist')
      }

      const { originUrl } = article.urls

      res.redirect(originUrl)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = articleController
