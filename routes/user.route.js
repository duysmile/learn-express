const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' })
const userController = require('../controllers/user.controller');
const userMiddleware = require('../middlewares/user.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', userController.index);

router.get('/profile', authMiddleware.requireAuth, userController.profile);

router.post('/profile', authMiddleware.requireAuth, userController.updateProfile);

router.get('/profile/avatar', authMiddleware.requireAuth, userController.changeAvatar);

router.post('/profile/avatar', authMiddleware.requireAuth, upload.single('avatar'), userController.postChangeAvatar);

router.get('/create', userController.create);

router.get('/:id/delete', userController.delete);

router.get('/:id', userController.get);

router.post('/create', userMiddleware.postCreate, userController.postCreate);

router.post('/:id', userController.postUpdate);

module.exports = router;
