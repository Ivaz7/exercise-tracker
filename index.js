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
// get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}).select("_id username")
    res.json(users)
  } catch (error) {
    res.json(error)
  }
})

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

// create exercise tracker
app.post('/api/users/:_id/exercises', async (req, res) => {
  const {
    description,
    duration,
    date
  } = req.body
  const id = req.params._id

  try {
    const user = await User.findById(id)

    if (!user) {
      res.send("The user is not found")
    } else {
      const exerciseObj = new Exercise({
        user_id: user._id,
        description,
        duration,
        date: date ? new Date(date) : new Date
      })
      const exercise = await exerciseObj.save()
      res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString()
      })
    }
  } catch (error) {
    res.json({
      error
    })
  }
})

// logs of exercise of user
app.get('/api/users/:_id/logs', async (req, res) => {
  const id = req.params._id
  const {
    from,
    to,
    limit
  } = req.query

  const user = await User.findById(id);

  if (!user) {
    res.send("The user is not found")
    return
  }

  let dateObj = {}
  if (from) {
    dateObj["$gte"] = new Date(from)
  }
  if (to) {
    dateObj["$lte"] = new Date(to)
  }

  let filter = {
    user_id: id
  }

  if (from || to) {
    filter.date = dateObj
  }

  try {
    const exercises = await Exercise.find(filter).limit(+limit ?? 500)

    const log = exercises.map(val => ({
      description: val.description,
      duration: val.duration,
      date: val.date.toDateString()
    }))

    res.json({
      username: user.username,
      count: exercises.length,
      _id: user._id,
      log
    })
  } catch (error) {
    res.json({
      error
    })
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
