const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const userMiddleware = require('../middlewares/user.middleware');

router.get('/', userController.index);

router.get('/create', userController.create);

router.get('/:id/delete', userController.delete);

router.get('/:id', userController.get);

router.post('/create', userMiddleware.postCreate, userController.postCreate);

router.post('/:id', userController.postUpdate);

module.exports = router;
