const multer = require('multer');
const express = require("express");

const router = express.Router();
const upload = multer({ dest: 'uploads/' })
const bookController = require("../controllers/book.controller");
const authMiddleware = require('../middlewares/auth.middleware');

router.get("/create", authMiddleware.requireAuth, bookController.create);

router.get("/list", authMiddleware.requireAuth, bookController.index);
router.get("/", bookController.list);

router.get("/:id/delete", authMiddleware.requireAuth, bookController.delete);

router.get("/:id", bookController.get);

router.post("/create", authMiddleware.requireAuth, upload.single('coverUrl'), bookController.postCreate);

router.post("/:id", bookController.postUpdate);

module.exports = router;
