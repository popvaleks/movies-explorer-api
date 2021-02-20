const Movie = require('../models/movie');
const NotFoundError = require('../error/NotFoundError');
const BadRequestError = require('../error/BadRequestError');
const ForbiddenError = require('../error/ForbiddenError');
const {
  uncorrectData,
  filmNotFound,
  forbiddenErrorMsg,
  noValidateId,
  filmListNotFound,
} = require('../utils/constantsErrorMsg');
const {
  removeMovie,
} = require('../utils/constantsMsg');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .sort('-createdAt')
    .then((movies) => {
      if (!movies) {
        return next(new NotFoundError(filmListNotFound));
      }
      if (movies.length === 0) {
        return next(new NotFoundError(filmListNotFound));
      }
      return res.send(movies);
    })
    .catch(next);
};

const postMovies = (req, res, next) => Movie.countDocuments()
  .then((count) => Movie.create({ id: count, owner: req.user._id, ...req.body })
    .then((movie) => {
      if (!movie) {
        return next(new BadRequestError(uncorrectData));
      }
      return res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(uncorrectData));
      }
      return next(err);
    }))
  .catch(next);

const deleteMovies = (req, res, next) => {
  const { _id } = req.params;
  Movie.findOne({ _id })
    .orFail(() => {
      throw new NotFoundError(filmNotFound);
    })
    .then((movies) => {
      if (movies.owner.toString() === req.user._id) {
        movies.remove()
          .then(() => res.send({ message: removeMovie }));
      } else {
        throw new ForbiddenError(forbiddenErrorMsg);
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return next(new BadRequestError(noValidateId));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  postMovies,
  deleteMovies,
};
