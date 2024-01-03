const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.json())


app.get('/', (req,res) => {
  res.send("hi")
})


app.listen(3000, () => {
  console.log('listening')
})