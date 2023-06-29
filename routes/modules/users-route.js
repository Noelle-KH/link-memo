const router = require('express').Router()

const userController = require('../../controllers/user-controller')
const {
  userFieldValidation,
  passwordFieldValidation
} = require('../../middleware/validation')
const upload = require('../../middleware/multer')
const { verifyUserStatus } = require('../../middleware/auth')

router.use('/:id', verifyUserStatus)

router.get('/:id/bookmarks', userController.getUserBookmark)

router.get('/:id/followings', userController.getUserFollowings)

router.get('/:id/followers', userController.getUserFollowers)

router.post('/:id/follows', userController.postUserFollow)
router.delete('/:id/follows', userController.deleteUserFollow)

router.get('/:id/articles', userController.getUserArticles)

router.get('/:id/comments', userController.getUserComments)

router.get('/:id', userController.getUser)

router.put(
  '/',
  upload.single('avatar'),
  userFieldValidation('update'),
  passwordFieldValidation('update'),
  userController.updateUser
)
router.patch('/', userController.changeUserStatus)

module.exports = router
