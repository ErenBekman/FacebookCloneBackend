const router = require('express').Router();
const userController = require('../controllers/UserController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, userController.index);
router.get('/:id', authenticateToken, userController.show);
router.post('/', authenticateToken, userController.create);
router.patch('/:id', authenticateToken, userController.update);
router.delete('/:id', authenticateToken, userController.destroy);
router.put('/:id/follow', authenticateToken, userController.follow);
router.put('/:id/unfollow', authenticateToken, userController.unfollow);

module.exports = router;
