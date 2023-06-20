const router = require('express').Router()
const articleController = require('../../controllers/article-controller')
const { articleFieldValidation } = require('../../middleware/validation')

router.post('/', articleFieldValidation, articleController.addArticle)

module.exports = router
