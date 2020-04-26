const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' })
const userController = require('../controllers/user.controller');
const userMiddleware = require('../middlewares/user.middleware');

router.get('/', userController.index);

router.get('/profile', userController.profile);

router.post('/profile', userController.updateProfile);

router.get('/profile/avatar', userController.changeAvatar);

router.post('/profile/avatar', upload.single('avatar'), userController.postChangeAvatar);

router.get('/create', userController.create);

router.get('/:id/delete', userController.delete);

router.get('/:id', userController.get);

router.post('/create', userMiddleware.postCreate, userController.postCreate);

router.post('/:id', userController.postUpdate);

module.exports = router;
