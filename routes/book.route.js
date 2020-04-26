const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");

router.get("/create", bookController.create);

router.get("/list", bookController.index);
router.get("/", bookController.list);

router.get("/:id/delete", bookController.delete);

router.get("/:id", bookController.get);

router.post("/create", bookController.postCreate);

router.post("/:id", bookController.postUpdate);

module.exports = router;
