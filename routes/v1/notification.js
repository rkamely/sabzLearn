const express = require('express');
const controller = require('../../controllers/v1/notification');
const authMiddleware = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();


router.route('/admin').get(authMiddleware, isAdmin, controller.getAdminNotification)
router.route('/').get(authMiddleware, isAdmin, controller.getAllNotification)
router.route('/').post(authMiddleware, isAdmin, controller.createNotification)
router.route('/:id/see').put(authMiddleware, isAdmin, controller.seen)


module.exports = router;