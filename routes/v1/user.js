const express = require('express');
const controller = require('../../controllers/v1/user');
const authMiddleware = require('../../middlewares/auth');
const isAdminMiddleware = require('../../middlewares/isAdmin');
const router = express.Router();



router.route('/').get(authMiddleware, isAdminMiddleware,controller.getUsers)
router.route('/:id').delete(authMiddleware, isAdminMiddleware,controller.getUsers)
router.route('/updateUser').put(authMiddleware,controller.updateUser)
router.route('/changeRole/:id').put(authMiddleware, isAdminMiddleware,controller.changeRole)
router.route('/ban/:id').post(authMiddleware, isAdminMiddleware, controller.banUser)


module.exports = router;