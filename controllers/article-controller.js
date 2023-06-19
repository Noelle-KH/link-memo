const Article = require('../models/article-model')
const {
  generateShortenUrl,
  generateQRCode,
  generateSummary
} = require('../helpers/article-helpers')

const articleController = {
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
        id: savedArticle._id
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = articleController
