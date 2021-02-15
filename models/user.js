const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const ErrorHandler = require('../middlewares/errorsHandler')

const userSchema = new mongoose.Schema({
  "name": {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  "email": {
    type: String,
    minlength: 2,
    maxlength: 254,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new ErrorHandler('Invalid Email Address', 400)
      }
    },
  },
  "password": {
    type: String,
    required: true,
    select: false,
  },
})

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorHandler('Не верный Email или пароль', 400)
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ErrorHandler('Не верный Email или пароль', 400)
          }

          return user
        })
    })
}

const userModel = mongoose.model('user', userSchema)

module.exports = userModel