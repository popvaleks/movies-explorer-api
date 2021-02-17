const router = require('express').Router();
const { getUserMe, updateUserInfo } = require('../controllers/users');
const { validateId, validateUserPatch } = require('../middlewares/validateCelebrate');

router.get('/users/me', validateId, getUserMe); // залогиненый пользователь
router.patch('/users/me', validateUserPatch, updateUserInfo);

module.exports = router;
