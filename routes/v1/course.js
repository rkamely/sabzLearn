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
router.route('/:id/session').post(multer({
  storage: multerStorage,
  limits: {fileSize: 1000000000}
}).single("video"), authMiddleware, isAdminMiddleware, controller.createSession)
router.route('/register').post(authMiddleware, controller.registerCourse)


router.route('/category/:href').get(controller.getCoursesByCategory)
router.route('/:href/:sessionId').get(controller.getCourseSessions)
router.route('/:href').get(controller.getCourseDetails)


router.route('/session/:id').delete(authMiddleware, isAdminMiddleware, controller.deleteSession)




module.exports = router;