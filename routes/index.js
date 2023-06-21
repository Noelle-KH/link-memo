const router = require('express').Router()

const authController = require('../controllers/auth-controller')
const articleController = require('../controllers/article-controller')
const errorHandler = require('../middleware/error-handler')
const { authFieldValidation } = require('../middleware/validation')
const { verifyToken } = require('../middleware/auth')

const users = require('./modules/users-route')
const articles = require('./modules/articles-route')
const comments = require('./modules/comments-route')

router.post('/register', authFieldValidation('register'), authController.register)

router.post('/login', authFieldValidation(), authController.login)

router.get('/:shortenUrl', articleController.goToOriginUrl)

router.use('/users', verifyToken, users)
router.use('/articles', verifyToken, articles)
router.use('/comments', verifyToken, comments)

router.use('/', errorHandler)

module.exports = router
