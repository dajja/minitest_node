const express = require('express')
var cors = require('cors')
const app = express()
const port = 8000
var bodyParser = require('body-parser')
var router = require('./todo');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true })) 
app.use(bodyParser.json())

app.use('/api/v1/todos', router);

app.listen(port, () => {
  console.log(`Port: http://localhost:${port}`)
})