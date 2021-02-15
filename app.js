require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const { celebrate, Joi, errors } = require('celebrate')
const cors = require('cors')

const usersRouter = require('./routes/users')
const { login, createUser, logout } = require('./controllers/users')
const movieRouter = require('./routes/movie')
const errorRouter = require('./routes/errorPage')
const auth = require('./middlewares/auth')
const { requestLogger, errorLogger } = require('./middlewares/logger')

// Слушаем 3000 порт
const { PORT = 3000 } = process.env

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

const app = express()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
})

app.use(limiter)
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: true })) // для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.json()) // для собирания JSON-формата

const whiteList = ['https://www.popvaleks.students.nomoreparties.xyz', 'https://popvaleks.students.nomoreparties.xyz', 'http://localhost:3000/']

app.use(cors({
  "origin": whiteList,
  // "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", // default
  // "preflightContinue": false,
  // "optionsSuccessStatus": 204,
  "credentials": true,
}))

app.use(requestLogger)

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт')
  }, 0)
})

app.post('/signin', login)
app.post('/signout', logout)
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser)
// Защита авторизацией
app.use(auth)
app.use('/', usersRouter, movieRouter, errorRouter)

app.use(errorLogger)

app.use(errors())

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    })
  next()
})

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})
