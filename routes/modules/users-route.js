const router = require('express').Router()

const userController = require('../../controllers/user-controller')
const { verifySelf } = require('../../middleware/auth')
const { userFieldValidation } = require('../../middleware/validation')
const upload = require('../../middleware/multer')

router.get('/:id/follows', userController.getUserFollows)
router.post('/:id/follows', userController.postUserFollow)
router.delete('/:id/follows', userController.deleteUserFollow)

router.get('/:id/articles', userController.getUserArticles)

router.get('/:id/comments', userController.getUserComments)

router.get('/:id', userController.getUser)
router.put('/:id', verifySelf, upload.single('avatar'), userFieldValidation, userController.updateUser)

module.exports = router
