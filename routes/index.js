const router = require('express').Router()

const authController = require('../controllers/auth-controller')
const articleController = require('../controllers/article-controller')
const errorHandler = require('../middleware/error-handler')
const {
  userFieldValidation,
  passwordFieldValidation
} = require('../middleware/validation')
const {
  verifyToken,
  verifyResetToken,
  verifyDisableStatus,
  verifyLoginUserStatus
} = require('../middleware/auth')

const users = require('./modules/users-route')
const articles = require('./modules/articles-route')
const comments = require('./modules/comments-route')
const tags = require('./modules/tags-route')

router.use(verifyDisableStatus)

router.post(
  '/register',
  userFieldValidation('register'),
  passwordFieldValidation('register'),
  authController.register
)

router.post(
  '/login',
  userFieldValidation('login'),
  passwordFieldValidation('login'),
  authController.login
)

router.post(
  '/reset-password',
  userFieldValidation('reset'),
  authController.confirmEmail
)

router.post(
  '/reset-password/:token',
  verifyResetToken,
  passwordFieldValidation('reset'),
  authController.resetPassword
)

router.use('/users', verifyToken, users)
router.use('/articles', verifyToken, verifyLoginUserStatus, articles)
router.use('/tags', verifyToken, verifyLoginUserStatus, tags)
router.use('/comments', verifyToken, verifyLoginUserStatus, comments)

router.get('/:shortenUrl', articleController.goToOriginUrl)

router.use('/', errorHandler)

module.exports = router
