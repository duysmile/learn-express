const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.post('/add/:id', cartController.addToCart);

module.exports = router;
