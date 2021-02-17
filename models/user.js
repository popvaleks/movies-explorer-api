const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const BadRequestError = require('../error/BadRequestError');
const {
  notValidEmail,
  wrongLoginData,
} = require('../utils/constantsErrorMsg');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    minlength: 2,
    maxlength: 254,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new BadRequestError(notValidEmail);
      }
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function hashPassword(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError(wrongLoginData);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadRequestError(wrongLoginData);
          }

          return user;
        });
    });
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
