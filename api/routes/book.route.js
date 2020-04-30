const multer = require('multer');
const express = require("express");

const router = express.Router();
const upload = multer({ dest: 'uploads/' })
const bookController = require("../controllers/book.controller");
const authMiddleware = require('../middlewares/auth.middleware');

router.get("/list", authMiddleware.requireAuth, bookController.index);
router.get("/", bookController.list);

router.delete("/:id/", authMiddleware.requireAuth, bookController.delete);

router.get("/:id", bookController.get);

router.post("/", authMiddleware.requireAuth, upload.single('coverUrl'), bookController.postCreate);

router.put("/:id", bookController.postUpdate);

module.exports = router;
