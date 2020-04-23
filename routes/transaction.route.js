const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

router.get('/', transactionController.index);

router.get('/create', transactionController.create);

router.get('/:id/delete', transactionController.delete);

router.post('/create', transactionController.postCreate);

router.get('/:id/complete', transactionController.complete);

module.exports = router;
