const router = require('express').Router()
const authRequired = require('../middleware/AuthMiddleware')
const {createPost, createComment, likeOrDislikePost} = require('../controllers/post/PostActions')
const {fetchAllPost, fetchPostById, fetchAllComment, fetchAllReaction, fetchTrendingPost, fetchUserPost} = require('../controllers/post/FetchPost')

router.post('/create-post', authRequired, createPost)
router.post('/create-comment', authRequired, createComment)
router.post('/like-dislike/:post_id', authRequired, likeOrDislikePost)

router.get('/posts', authRequired, fetchAllPost)
router.get('/trending', authRequired, fetchTrendingPost)
router.get('/posts/:post_id', authRequired, fetchPostById)
router.get('/comments/:post_id', authRequired, fetchAllComment)
router.get('/reactions/:post_id', authRequired, fetchAllReaction)
router.get('/user-posts', authRequired, fetchUserPost)

module.exports  = router