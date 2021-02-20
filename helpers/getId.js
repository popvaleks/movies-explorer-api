const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config');
const { getCookie } = require('./getCookie');

module.exports = {
  getId(req) {
    const token = getCookie('jwt', req);
    const decoded = jwt.verify(token, JWT_SECRET);
    const { _id } = decoded;
    if (_id) { return (_id); }
    return null;
  },
};
