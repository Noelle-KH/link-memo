if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoose = require('mongoose')
const Tag = require('../tag-model')
const tagData = require('./tag.json')

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.once('open', async () => {
  try {
    await Tag.insertMany(tagData)
    console.log('Tag seed insert done')

    process.exit()
  } catch (error) {
    console.log(error.message)
  }
})
