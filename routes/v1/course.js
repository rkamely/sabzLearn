const express = require('express');
const controller = require('../../controllers/v1/course');
const authMiddleware = require('../../middlewares/auth');
const isAdminMiddleware = require('../../middlewares/isAdmin');
const multer = require('multer');
const multerStorage = require('../../utils/uploader');

const router = express.Router();


router.route('/').post(multer({
  storage: multerStorage,
  limits: {fileSize: 1000000000}
}).single("cover"), authMiddleware, isAdminMiddleware, controller.createCourse)


module.exports = router;