const router = require('express').Router()

const commentController = require('../../controllers/comment-controller')

router.get('/:id', commentController.getComment)
router.put('/:id', commentController.updateComment)
router.delete('/:id', commentController.deleteComment)

module.exports = router
