const express = require('express');
const controller = require('../../controllers/v1/article');
const authMiddleware = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');
const multer = require("multer");
const multerStorage = require("../../utils/uploader");

const router = express.Router();

router.route('/:href').get(controller.getOneArticle)

router.route('/').get(controller.getAllArticle)

router.route('/:id').put(authMiddleware, isAdmin, multer({
  storage: multerStorage,
  limits: {fileSize: 1000000000}
}).single("cover"), controller.editArticle)

router.route('/').post(authMiddleware, isAdmin, multer({
  storage: multerStorage,
  limits: {fileSize: 1000000000}
}).single("cover"), controller.createArticle)

router.route('/:id').delete(authMiddleware, isAdmin, controller.removeArticle)

module.exports = router;