const mongoose = require('mongoose');
const { Types } = require('mongoose');
const validator = require('validator');

const BadRequestError = require('../error/BadRequestError');
const {
  uncorrectUrlImg,
  uncorrectUrlTrailer,
  uncorrectUrlThumbnail,
} = require('../utils/constantsErrorMsg');

const movieSchema = new mongoose.Schema({
  nameRU: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  nameEN: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  country: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  director: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  duration: {
    type: Number,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  year: {
    type: String,
    minlength: 4,
    maxlength: 32,
    required: true,
  },
  description: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isURL(value)) {
        return value;
      }
      throw new BadRequestError(uncorrectUrlImg);
    },
  },
  trailer: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isURL(value)) {
        return value;
      }
      throw new BadRequestError(uncorrectUrlTrailer);
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isURL(value)) {
        return value;
      }
      throw new BadRequestError(uncorrectUrlThumbnail);
    },
  },
  movieId: {
    type: Number,
    // unique: true,
    required: true,
  },
  owner: {
    type: Types.ObjectId,
  },
});

const movieModel = mongoose.model('movie', movieSchema);

module.exports = movieModel;
