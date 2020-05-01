const express = require("express");

const router = express.Router();
const shopController = require("../controllers/shop.controller");
const authMiddleware = require('../middlewares/auth.middleware');

router.get("/create", authMiddleware.requireAuth, shopController.postCreate);

router.get("/:id/books", shopController.getBooks);

module.exports = router;
