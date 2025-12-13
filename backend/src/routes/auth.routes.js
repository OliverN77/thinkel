const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', protect, getProfile);
router.put('/auth/profile', protect, upload.single('avatar'), updateProfile);

module.exports = router;