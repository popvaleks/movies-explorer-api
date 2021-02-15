const router = require('express').Router()
const { celebrate, Joi } = require('celebrate')
const {
  getUserMe,
  updateUserInfo,
} = require('../controllers/users')
const { validateId } = require('../helpers/validateForCelebrate')

router.get('/users/me', validateId, getUserMe) // залогиненый пользователь
router.patch('/users/me', celebrate({
  body:
    Joi.object({
      email: Joi.string().email().trim(),
      name: Joi.string().trim().min(2).max(30),
    }).min(1),
}), updateUserInfo)

module.exports = router