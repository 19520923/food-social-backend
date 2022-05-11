const { fetchUserById, searchUsers, me } = require('../controllers/user/FetchUser')
const { followUser, unFollow } = require('../controllers/user/UserActions')
const router = require('express').Router()
const authRequired = require('../middleware/AuthMiddleware')

router.get('/fetchUserById/:user_id', authRequired, fetchUserById)
router.get('/searchUsers/:search', authRequired, searchUsers)
router.get('/me', authRequired, me)

router.post('/follow/:user_id', authRequired, followUser)
router.post('/unfollow/:user_id', authRequired, unFollow)

module.exports = router