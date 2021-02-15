const jwt = require('jsonwebtoken')
const { NODE_ENV, JWT_SECRET } = process.env
const { getCookie } = require('./getCookie')

module.exports = {
  getId: function (req) {
    const token = getCookie('jwt', req)
    const decoded = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'world-secret')
    const _id = decoded._id
    if (_id)
      return (_id)
    else
      return null
  },
}