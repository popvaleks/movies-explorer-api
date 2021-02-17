const router = require('express').Router();

const usersRouter = require('./users');
const movieRouter = require('./movie');
const auth = require('../middlewares/auth');
const eroorRouter = require('../middlewares/notFoundPage');
const crashTest = require('../middlewares/crashTest');
const { validateUserCreate } = require('../middlewares/validateCelebrate');
const { login, createUser, logout } = require('../controllers/users');

router.post('/signin', login);
router.post('/signout', logout);
router.post('/signup', validateUserCreate, createUser);
router.use(auth);
router.use('/', usersRouter, movieRouter);
router.use(eroorRouter);
router.get(crashTest);

module.exports = router;
