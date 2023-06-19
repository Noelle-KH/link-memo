const router = require('express').Router()
const articleController = require('../../controllers/article-controller')

router.post('/', articleController.addArticle)

module.exports = router
