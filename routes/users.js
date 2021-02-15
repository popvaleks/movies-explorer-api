const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const {
  getUserMe,
  updateUserInfo,
} = require('../controllers/users')
const { validateId } = require('../helpers/validateForCelebrate')

router.get('/users/me', validateId, getUserMe) // залогиненый пользователь
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateUserInfo)

module.exports = router