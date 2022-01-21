const express = require('express')
const { createComment, deleteComment, updateComment, getComments } = require('../controller/commentController')
const router = express.Router({ mergeParams: true })

router.post('/', createComment)
router.delete('/:commentId', deleteComment)
router.patch('/:commentId', updateComment)
router.get('/', getComments)
module.exports = router
