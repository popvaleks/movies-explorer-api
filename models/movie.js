const mongoose = require('mongoose')
const { Types } = require('mongoose')
const { linkRegExp } = require('../helpers/regExp')

const movieSchema = new mongoose.Schema({
  "nameRU": {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  "nameEN": {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  "country": {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  "director": {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  "duration": {
    type: Number,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  "year": {
    type: String,
    minlength: 4,
    maxlength: 32,
    required: true,
  },
  "description": {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  "image": {
    type: String,
    required: true,
    validate: {
      validator: v => {
        // return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
        return new RegExp(linkRegExp).test(v)
      },
      message: 'Не корректная ссылка', // err.name === 'ValidationError'
    },
  },
  "trailer": {
    type: String,
    required: true,
    validate: {
      validator: v => {
        return new RegExp(linkRegExp).test(v)
      },
      message: 'Не корректная ссылка',
    },
  },
  "thumbnail": {
    type: String,
    required: true,
    validate: {
      validator: v => {
        return new RegExp(linkRegExp).test(v)
      },
      message: 'Не корректная ссылка',
    },
  },
  "movieId": { // валидируется при помощи celebrate
    type: String,
    // unique: true,
    required: true,
  },
  "owner": {
    type: Types.ObjectId,
  },
})

const movieModel = mongoose.model('movie', movieSchema)

module.exports = movieModel