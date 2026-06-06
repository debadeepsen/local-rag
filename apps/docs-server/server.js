const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())

app.use(
  '/docs',
  express.static(
    path.join(__dirname, '../../data/raw-docs')
  )
)

app.listen(3001, () => {
  console.log('Docs server running on 3001')
})
