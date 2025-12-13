const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getPosts, 
  getPostBySlug, 
  getPostById,
  updatePost, 
  deletePost,
  toggleLike,
  toggleBookmark,
  getMyPosts,
  getBookmarkedPosts,
  getUserStats
} = require('../controllers/post.controller');
const { protect } = require('../middlewares/auth.middleware');

// Rutas públicas
router.get('/posts', getPosts);
router.get('/posts/slug/:slug', getPostBySlug);
router.get('/posts/:id', getPostById);

// Rutas protegidas (requieren autenticación)
router.post('/posts', protect, createPost);
router.put('/posts/:id', protect, updatePost);
router.delete('/posts/:id', protect, deletePost);

// Interacciones con posts
router.post('/posts/:id/like', protect, toggleLike);
router.post('/posts/:id/bookmark', protect, toggleBookmark);

// Posts del usuario
router.get('/posts/my/all', protect, getMyPosts);
router.get('/posts/my/bookmarked', protect, getBookmarkedPosts);
router.get('/posts/my/stats', protect, getUserStats);

module.exports = router;
