const router = require('express').Router()

const userController = require('../../controllers/user-controller')

router.get('/:id/follows', userController.getUserFollows)
router.post('/:id/follows', userController.postUserFollow)
router.delete('/:id/follows', userController.deleteUserFollow)

router.get('/:id/articles', userController.getUserArticles)

router.get('/:id/comments', userController.getUserComments)

router.get('/:id', userController.getUser)

module.exports = router
