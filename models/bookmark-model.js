const { Schema, model } = require('mongoose')

const bookmarkSchema = new Schema({
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
})

module.exports = model('Bookmark', bookmarkSchema)
