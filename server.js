const cors = require('cors')
const express = require('express')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')

const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.get('/', (req, res) => {
  res.send('<h1>Hello</h1>')
})

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      supportedSubmitMethods: []
    }
  })
)

app.all('*', (req, res) => {
  const errors = {
    status: 404,
    message: 'Route Not Found'
  }

  res.status(404).json({ errors })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
