const { Schema, model, Types } = require('mongoose')

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

bookmarkSchema.statics.getAggregate = function (id) {
  return this.aggregate()
    .lookup({
      from: 'users',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    })
    .match({
      userId: new Types.ObjectId(id),
      'user.deletedAt': null
    })
    .lookup({
      from: 'articles',
      localField: 'articleId',
      foreignField: '_id',
      as: 'article'
    })
    .unwind('$article')
    .project({
      title: '$article.title'
    })
}

module.exports = model('Bookmark', bookmarkSchema)
