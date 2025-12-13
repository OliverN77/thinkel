const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', postController.getAllPosts);
router.get('/slug/:slug', postController.getPostBySlug);
router.get('/:id', postController.getPostById);
router.post('/', authMiddleware, postController.createPost);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);
router.post('/:id/like', authMiddleware, postController.toggleLike);
router.post('/:id/bookmark', authMiddleware, postController.toggleBookmark);

module.exports = router;
