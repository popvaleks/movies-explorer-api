const NotFoundError = require('../error/NotFoundError');
const { cookieNotFound } = require('../utils/constantsErrorMsg');

module.exports = {
  getCookie(cookieName, req, next) {
    try {
      if (req.headers.cookie) {
        const results = req.headers.cookie.match(`(^|;) ?${cookieName}=([^;]*)(;|$)`);
        if (results) {
          return (unescape(results[2]));
        } return next(new NotFoundError(cookieNotFound));
      }
      return null;
    } catch (err) {
      return next(err);
    }
  },
};
