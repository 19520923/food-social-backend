const {fetchUserById, searchUsers, me} = require('../controllers/user/FetchUser')
const {followUser} = require('../controllers/user/UserActions')
const router = require('express').Router()
const authRequired = require('../middleware/AuthMiddleware')

router.get('/fetchUserById/:user_id',authRequired ,fetchUserById)
router.get('/searchUsers/:search', authRequired, searchUsers)
router.get('/me', authRequired,me)

router.post('/follow/:user_id', authRequired, followUser)

module.exports = router