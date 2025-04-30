const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')
const { Schema } = mongoose

// database config
mongoose.connect(process.env.DB_URL)

const UserSchema = new Schema({
  username: String
})
const ExerciseSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  description: String,
  duration: Number,
  date: Date
})

const User = mongoose.model("User", UserSchema)
const Exercise = mongoose.model("Exercise", ExerciseSchema)

// basic config
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// api request
// create user
app.post('/api/users', async (req, res) => {
  const { username } = req.body
  const userObj = new User({
    username,
  })

  try {
    const user = await userObj.save()
    res.json(user)
  } catch (err) {
    res.json({
      error: err
    })
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
