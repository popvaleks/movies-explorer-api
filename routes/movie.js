const router = require('express').Router()
const { celebrate } = require('celebrate')
const Joi = require('joi')
const {
  getMovies, postMovies, deleteMovies,
} = require('../controllers/movies')
const { linkRegExp } = require('../helpers/regExp')
const { validateId } = require('../helpers/validateForCelebrate')

router.get('/movies', getMovies)
router.post('/movies', celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required().min(0).max(500),
    year: Joi.string().required().min(4).max(32),
    description: Joi.string().required().min(2).max(200),
    image: Joi.string().required().pattern(new RegExp(linkRegExp)),
    trailer: Joi.string().required().pattern(new RegExp(linkRegExp)),
    thumbnail: Joi.string().required().pattern(new RegExp(linkRegExp)),
    movieId: Joi.string().hex().required(),
  }),
}), postMovies)
router.delete('/movies/:_id', validateId, deleteMovies)

module.exports = router