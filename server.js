const cors = require('cors')
const express = require('express')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello</h1>')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
