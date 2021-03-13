const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  notValidEmail,
  emptyEmail,
  lowPass,
  emptyPass,
  lowName,
  maxName,
  emptyName,
  lowNameEn,
  maxNameEn,
  emptyNameEn,
  empDescription,
  maxDescription,
  lowDescription,
  maxYear,
  emptyYear,
  lowYear,
  emptyDuration,
  emptyDirector,
  lowDuration,
  maxDuration,
  lowDirector,
  maxDirector,
  lowCountry,
  maxCountry,
  emptyCountry,
  uncorrectLink,
  uncorrectLinkTrailer,
  emptyTrailer,
  uncorrectThumbnail,
  oneOfInput,
  emptyThumbnail,
  empryMovieId,
  emptyImg,
} = require('../utils/constantsErrorMsg');

const validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message(notValidEmail)
      .messages({
        'any.required': emptyEmail,
      }),
    password: Joi.string().required().min(8)
      .messages({
        'string-min': lowPass,
        'any.required': emptyPass,
      }),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string-min': lowName,
        'string-max': maxName,
        'any.required': emptyName,
      }),
  }),
});

const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email()
      .message(notValidEmail)
      .messages({
        'any.required': emptyEmail,
      }),
    password: Joi.string().required().min(8)
      .messages({
        'string-min': lowPass,
        'any.required': emptyPass,
      }),
  }),
});

const validateMoviesCreate = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().required().min(2).max(100)
      .messages({
        'string-min': lowName,
        'string-max': maxName,
        'any.required': emptyName,
      }),
    nameEN: Joi.string().required().min(2).max(100)
      .messages({
        'string-min': lowNameEn,
        'string-max': maxNameEn,
        'any.required': emptyNameEn,
      }),
    country: Joi.string().required().min(2).max(100)
      .messages({
        'string-min': lowCountry,
        'string-max': maxCountry,
        'any.required': emptyCountry,
      }),
    director: Joi.string().required().min(2).max(100)
      .messages({
        'string-min': lowDirector,
        'string-max': maxDirector,
        'any.required': emptyDirector,
      }),
    duration: Joi.number().required().min(0).max(500)
      .messages({
        'string-min': lowDuration,
        'string-max': maxDuration,
        'any.required': emptyDuration,
      }),
    year: Joi.string().required().min(4).max(32)
      .messages({
        'string-min': lowYear,
        'string-max': maxYear,
        'any.required': emptyYear,
      }),
    description: Joi.string().required().min(2).max(65535)
      .messages({
        'string-min': lowDescription,
        'string-max': maxDescription,
        'any.required': empDescription,
      }),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(uncorrectLink);
    })
      .messages({
        'any.required': emptyImg,
      }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(uncorrectLinkTrailer);
    })
      .messages({
        'any.required': emptyTrailer,
      }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(uncorrectThumbnail);
    })
      .messages({
        'any.required': emptyThumbnail,
      }),
    movieId: Joi.number().required()
      .messages({
        'any.required': empryMovieId,
      }),
  }),
});

const validateUserPatch = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email()
      .message(notValidEmail),
    name: Joi.string().min(2).max(30)
      .messages({
        'string-min': lowName,
        'string-max': maxName,
      }),
  }).min(1)
    .message(oneOfInput),
});

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports = {
  validateUserCreate,
  validateUserPatch,
  validateId,
  validateMoviesCreate,
  validateUserLogin,
};
