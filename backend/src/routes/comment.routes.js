const express = require('express');
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
  toggleLikeComment
} = require('../controllers/comment.controller');
const { protect } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/posts/:postId/comments', getCommentsByPost);

// Rutas protegidas
router.post('/comments', protect, createComment);
router.put('/comments/:id', protect, updateComment);
router.delete('/comments/:id', protect, deleteComment);
router.post('/comments/:id/like', protect, toggleLikeComment);

module.exports = router;
