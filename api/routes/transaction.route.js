const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.get('/', transactionController.index);

router.post('/add', transactionController.addFromCart);

router.delete('/:id/', transactionController.delete);

router.post('/', transactionController.postCreate);

router.put('/:id', transactionController.complete);

module.exports = router;
