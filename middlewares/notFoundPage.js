const router = require('express').Router();

const NotFoundError = require('../error/NotFoundError');
const { routeNotFound } = require('../utils/constantsErrorMsg');

router.use('*', () => {
  throw new NotFoundError(routeNotFound);
});

module.exports = router;
