const router = require('express').Router()

const authController = require('../controllers/auth-controller')
const errorHandler = require('../middleware/error-handler')
const { fieldValidation } = require('../middleware/validation')
const { verifyToken } = require('../middleware/auth')

const users = require('./modules/users-route')
const articles = require('./modules/articles-route')

router.post('/register', fieldValidation('register'), authController.register)
router.post('/login', fieldValidation(), authController.login)

router.use('/users', verifyToken, users)
router.use('/articles', verifyToken, articles)

router.use('/', errorHandler)

module.exports = router
