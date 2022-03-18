const router = require('express').Router()
const authRequired = require('../middleware/AuthMiddleware')
const {createPost, createComment, likeOrDislikePost} = require('../controllers/post/PostActions')
const {fetchAllPost, fetchPostById, fetchAllComment, fetchAllReaction} = require('../controllers/post/FetchPost')

router.post('/create-post', authRequired, createPost)
router.post('/create-comment', authRequired, createComment)
router.post('/like-dislike/:post_id', authRequired, likeOrDislikePost)

router.get('/posts', authRequired, fetchAllPost)
router.get('/:post_id', authRequired, fetchPostById)
router.get('/comments/:post_id', authRequired, fetchAllComment)
router.get('/reactions/:post_id', authRequired, fetchAllReaction)

module.exports  = router