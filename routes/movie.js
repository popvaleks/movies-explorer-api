const router = require('express').Router();

const {
  getMovies, postMovies, deleteMovies,
} = require('../controllers/movies');
const { validateMoviesCreate, validateId } = require('../middlewares/validateCelebrate');

router.get('/movies', getMovies);
router.post('/movies', validateMoviesCreate, postMovies);
router.delete('/movies/:_id', validateId, deleteMovies);

module.exports = router;
