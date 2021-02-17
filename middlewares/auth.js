const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const { getCookie } = require('../helpers/getCookie');
const UnauthorizedError = require('../error/UnauthorizedError');
const { unauthorizedMsg } = require('../utils/constantsErrorMsg');

module.exports = (req, res, next) => {
  const token = getCookie('jwt', req);

  if (!token) {
    return next(new UnauthorizedError(unauthorizedMsg));
  }
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError(unauthorizedMsg));
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  return next(); // пропускаем запрос дальше
};
