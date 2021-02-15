const bcrypt = require('bcryptjs')
const { NODE_ENV, JWT_SECRET } = process.env
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { getId } = require('../helpers/getId')
const ErrorHandler = require('../middlewares/errorsHandler')

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => User.create({
      email: req.body.email,
      password: hash, // записываем хеш в базу
      name: req.body.name,
    }))
    .then((users) => {
      res.send({
        name: users.name,
        _id: users._id,
        email: users.email,
      })
    })
    .catch((err) => {
      const duplicateErrorCode = 11000
      if (err.code === duplicateErrorCode) {
        return next(new ErrorHandler('Пользователь с таким Email уже зарегестрирован', 409))
      }
      next(err)
    })
}

const login = (req, res, next) => {
  const { email, password } = req.body
  // Проверка с ошибками уже в схеме
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'world-secret', { expiresIn: '7d' })
      res.cookie('jwt', token, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: false,
        path: '/',
        domain: 'popvaleks.students.nomoreparties.xyz',
        secure: true,
        // domain: '', // localhost only
        credentials: 'include',
      })
        .send({ message: 'Вы успешно авторизаровались' }) // Возвращает JWT?
    })
    .catch(next)
}

const logout = (req, res, next) => {
  try {
    return res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: false,
      path: '/',
      // domain: 'popvaleks.students.nomoreparties.xyz',
      // secure: true,
      domain: '',
      credentials: 'include',
    })
      .send({ message: 'Куки удалены' })
  } catch (err) {
    next(err)
  }
}

const getUserMe = (req, res, next) => {
  const _id = getId(req)
  User.findOne({ _id })
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      })
    })
    .catch(next)
}

const updateUserInfo = (req, res, next) => {
  const _id = getId(req)
  const { name, email } = req.body
  User.find({ email })
    .then((user) => {
      if (user.length >= 1) {
        return next(new ErrorHandler('Пользователь с таким Email уже зарегестрирован', 409))
      } else {
        User.findOneAndUpdate({ _id }, { name, email },
          { new: true, runValidators: true, omitUndefined: true })
          // все сценарии отрабатываются при логине, проверка ошибок под вопросом
          .orFail(() => {
            throw new ErrorHandler('Пользователь не найден', 404)
          })
          .then((user) => {
            res.send({
              name: user.name,
              email: user.email,
            })
          })
          .catch((err) => {
            if (err.kind === "ObjectId") {
              return next(new ErrorHandler('Не валидный id', 400))
            }
            next(err)
          })
      }
    })
    .catch(next)
}

module.exports = {
  login,
  updateUserInfo,
  createUser,
  getUserMe,
  logout,
}
