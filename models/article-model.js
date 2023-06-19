const { Schema, model } = require('mongoose')
const { generateShortenUrl } = require('../helpers/article-helpers')

const urlSchema = new Schema(
  {
    originUrl: {
      type: String,
      required: true
    },
    shortenUrl: {
      type: String,
      required: true
    },
    qrCode: {
      type: String,
      required: true
    }
  },
  { _id: false }
)

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    urls: {
      type: urlSchema,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    record: {
      type: String
    },
    tagsId: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

articleSchema.pre('save', async function (next) {
  const Model = this.constructor
  const shortenUrl = this.urls.shortenUrl
  const existedShortenUrl = await Model.findOne({ urls: { shortenUrl } })
  if (existedShortenUrl) {
    this.urls.shortenUrl = generateShortenUrl()

    return this.validate(next)
  }

  next()
})

module.exports = model('Article', articleSchema)
