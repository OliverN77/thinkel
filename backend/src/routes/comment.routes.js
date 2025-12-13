const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/post/:postId', commentController.getCommentsByPost);
router.post('/', authMiddleware, commentController.createComment);
router.put('/:id', authMiddleware, commentController.updateComment);
router.delete('/:id', authMiddleware, commentController.deleteComment);
router.post('/:id/like', authMiddleware, commentController.toggleLikeComment);

module.exports = router;
