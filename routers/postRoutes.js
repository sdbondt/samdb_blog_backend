const express = require('express')
const { getPosts, createPost, getPost, updatePost, deletePost, likePost, unlikePost, getLikesByPost } = require('../controller/postController')
const router = express.Router()
const commentRouter = require('./commentRouter')

router.use('/:id/comments', commentRouter)

router.post('/' ,createPost)
router.get('/', getPosts)
router.get('/:id', getPost)
router.patch('/:id', updatePost)
router.delete('/:id', deletePost)
router.post('/:id/like', likePost)
router.post('/:id/unlike', unlikePost)
router.get('/:id/likes', getLikesByPost)


module.exports = router