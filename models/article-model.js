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

articleSchema.virtual('articleCommentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'articleId',
  count: true
})

articleSchema.virtual('articleBookmarkCount', {
  ref: 'Bookmark',
  localField: '_id',
  foreignField: 'articleId',
  count: true
})

articleSchema.statics.getAggregate = function (sortedBy) {
  return this.aggregate()
    .lookup({
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    })
    .match({
      'user.deletedAt': null
    })
    .lookup({
      from: 'comments',
      localField: 'articleId',
      foreignField: '_id',
      as: 'articleCommentCount'
    })
    .lookup({
      from: 'bookmarks',
      localField: 'articleId',
      foreignField: '_id',
      as: 'articleBookmarkCount'
    })
    .addFields({
      articleCommentCount: { $size: '$articleCommentCount' },
      articleBookmarkCount: { $size: '$articleBookmarkCount' }
    })
    .sort({ [sortedBy]: -1 })
    .project({
      title: 1,
      urls: 1,
      summary: 1,
      record: 1,
      tagsId: 1,
      articleCommentCount: 1,
      articleBookmarkCount: 1
    })
}

module.exports = model('Article', articleSchema)
