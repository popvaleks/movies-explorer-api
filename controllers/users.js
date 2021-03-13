const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { getId } = require('../helpers/getId');
const BadRequestError = require('../error/BadRequestError');
const ConflictError = require('../error/ConflictError');
const NotFoundError = require('../error/NotFoundError');
const {
  JWT_SECRET, domainCookie, secureCookie,
} = require('../config');
const {
  conflictEmail,
  userNotFound,
  noValidateId,
} = require('../utils/constantsErrorMsg');
const {
  removieCookies,
} = require('../utils/constantsMsg');

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash, // записываем хеш в базу
      name: req.body.name,
    }))
    .then((users) => {
      res.send({
        name: users.name,
        _id: users._id,
        email: users.email,
      });
    })
    .catch((err) => {
      const duplicateErrorCode = 11000;
      if (err.code === duplicateErrorCode) {
        return next(new ConflictError(conflictEmail));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  // Проверка с ошибками уже в схеме
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('aaaaaa', token, {
        maxAge: 60 * 60 * 24 * 7 * 1000,
        httpOnly: false,
        path: '/',
        domain: 'popvaleks.students.nomoreparties.xyz',
        secure: true,
        credentials: 'include',
      })
        .send({ jwt: token });
    })
    .catch(next);
};

const logout = (req, res, next) => {
  try {
    return res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: false,
      path: '/',
      domain: domainCookie,
      secure: secureCookie,
      credentials: 'include',
    })
      .send({ message: removieCookies });
  } catch (err) {
    return next(err);
  }
};

const getUserMe = (req, res, next) => {
  const _id = getId(req);
  User.findOne({ _id })
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  const _id = getId(req);
  const { name, email } = req.body;
  User.find({ email })
    .then((user) => {
      if (user.length >= 1) {
        return next(new ConflictError(conflictEmail));
      }
      return User.findOneAndUpdate({ _id }, { name, email },
        { new: true, runValidators: true, omitUndefined: true })
        // все сценарии отрабатываются при логине, проверка ошибок под вопросом
        .orFail(() => {
          throw new NotFoundError(userNotFound);
        })
        .then((data) => {
          res.send({
            name: data.name,
            email: data.email,
          });
        })
        .catch((err) => {
          if (err.kind === 'ObjectId') {
            return next(new BadRequestError(noValidateId));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports = {
  login,
  updateUserInfo,
  createUser,
  getUserMe,
  logout,
};
