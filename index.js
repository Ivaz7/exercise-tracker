const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient } = require('mongodb')

// configuration
app.use(cors())
app.use(express.static('public'))
const client = new MongoClient(process.env.DB_URL)
const db = client.db("exerciseTracker")
const users = db.collection("users")
const exercise = db.collection("exercise")

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// api request



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
