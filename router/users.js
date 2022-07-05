const router = require('express').Router()
const userController = require('../../controllers/UserController')

router.get('/', userController.index)
router.get('/:id', userController.show)
router.post('/', userController.create)
router.patch('/:id', userController.update)
router.delete('/:id', userController.destroy)

module.exports = router