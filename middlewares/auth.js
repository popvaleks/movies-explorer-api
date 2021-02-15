const jwt = require('jsonwebtoken')
const { NODE_ENV, JWT_SECRET } = process.env
const { getCookie } = require('../helpers/getCookie')
const ErrorHandler = require('./errorsHandler')

module.exports = (req, res, next) => {
  const token = getCookie('jwt', req)

  if (!token) {
    return next(new ErrorHandler('Данный контент доступен только авторизиованным пользхователям', 401))
  }
  let payload

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'world-secret')
  } catch (err) {
    next(new ErrorHandler('Данный контент доступен только авторизиованным пользхователям', 401))
  }
  req.user = payload // записываем пейлоуд в объект запроса
  next() // пропускаем запрос дальше
}
