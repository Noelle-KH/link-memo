const { Schema, model } = require('mongoose')

const tagSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }
})

module.exports = model('Tag', tagSchema)
