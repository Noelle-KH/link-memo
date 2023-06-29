const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true
    }
  },
  { timestamps: true }
)

commentSchema.statics.getAggregate = function (articleId) {
  return this.aggregate()
    .lookup({
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    })
    .match({ articleId, 'user.deletedAt': null })
    .sort({ createdAt: -1 })
    .project({
      content: 1
    })
}

module.exports = model('Comment', commentSchema)
