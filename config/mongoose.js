const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected')
})

mongoose.connection.on('error', (error) => {
  console.log(error.message)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  process.exit()
})
