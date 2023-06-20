const router = require('express').Router()
const articleController = require('../../controllers/article-controller')
const { articleFieldValidation } = require('../../middleware/validation')

router.get('/:id', articleController.getArticle)
router.put('/:id', articleController.updateArticle)
router.delete('/:id', articleController.deleteArticle)

router.get('/', articleController.getArticles)
router.post('/', articleFieldValidation, articleController.addArticle)

module.exports = router
