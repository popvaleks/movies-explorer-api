const router = require('express').Router()
const ErrorHandler = require('../middlewares/errorsHandler')

router.get('*', (req, res, next) => {
  return next(new ErrorHandler('Запрашиваемый ресурс не найден', 404))
})

module.exports = router