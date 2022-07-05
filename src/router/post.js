const router = require('express').Router();
const postController = require('../controllers/PostController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, postController.index);
router.get('/:id', authenticateToken, postController.show);
router.post('/', authenticateToken, postController.create);
router.patch('/:id', authenticateToken, postController.update);
router.delete('/:id', authenticateToken, postController.destroy);
router.put('/:id/like', authenticateToken, postController.like);
router.post('/timeline/all', authenticateToken, postController.timeline);

module.exports = router;
