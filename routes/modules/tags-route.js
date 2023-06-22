const router = require('express').Router()

const tagController = require('../../controllers/tag-controller')

router.get('/:id', tagController.getTag)
router.put('/:id', tagController.updateTag)
router.delete('/:id', tagController.deleteTag)

router.get('/', tagController.getTags)
router.post('/', tagController.addTag)

module.exports = router
