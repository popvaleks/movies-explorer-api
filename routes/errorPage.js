const router = require('express').Router()
const ErrorHandler = require('../middlewares/errorsHandler')

router.get('*', (req, res, next) => {
  // res.status(404).send({ message: `Запрашиваемый ресурс не найден` })
  return next(new ErrorHandler('Запрашиваемый ресурс не найден', 404))
})

module.exports = router