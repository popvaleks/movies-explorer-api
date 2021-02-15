const Movie = require('../models/movie')
const ErrorHandler = require('../middlewares/errorsHandler')

const getMovies = (req, res, next) => {
  // const movieList = Movie.find({})
  // console.log(movieList)
  // Movie.filter(item => item.owner === req.user._id)
  Movie.find({ owner: req.user._id })
    .sort('-createdAt')
    .then((movies) => {
      if (!movies) {
        return next(new ErrorHandler('Список фильмов отсутствует', 404))
      }
      if (movies.length === 0) {
        return next(new ErrorHandler('Фильмотека не найдена', 404))
      }
      res.send(movies)
    })
    .catch(next)
}

const postMovies = (req, res, next) => {
  return Movie.countDocuments()
    .then(count => {
      return Movie.create({ id: count, owner: req.user._id, ...req.body })
        .then((movie) => {
          if (!movie) {
            return next(new ErrorHandler('Ошибка при передаче данных', 400))
          }
          res.send(movie)
        })
        .catch(err => {
          if (err.name === 'ValidationError') {
            return next(new ErrorHandler('Переданы не корректные данные', 400))
          }
          next(err)
        })
    })
    .catch(next)
}

const deleteMovies = (req, res, next) => {
  const { _id } = req.params
  Movie.findOne({ _id })
    .orFail(() => {
      throw new ErrorHandler('Фильм отсутвует в списке', 404)
    })
    .then((movies) => {
      if (movies.owner.toString() === req.user._id) {
        movies.remove()
          .then((removeMovie) => res.send({ message: `Фильм «${removeMovie.nameRU}» успешно удален` }))
      } else {
        throw new ErrorHandler('Вы не можете удалить фильм сохраненный другим пользователем', 401)
      }
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return next(new ErrorHandler('Не валидный id', 400))
      }
      next(err)
    })
}

module.exports = {
  getMovies,
  postMovies,
  deleteMovies,
}
