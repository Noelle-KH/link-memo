const { Schema, model } = require('mongoose')

const commentSchema = new Schema(
  {
    comment: {
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

module.exports = model('Comment', commentSchema)
