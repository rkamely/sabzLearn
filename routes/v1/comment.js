const express = require('express');
const controller = require('../../controllers/v1/comment');
const authMiddleware = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();

router.route('/:id/answer').post(authMiddleware, isAdmin, controller.answerComment)
router.route('/').post(authMiddleware, controller.createComment)
router.route('/:id').delete(authMiddleware, isAdmin, controller.deleteComment)
router.route('/:id/accept').put(authMiddleware, isAdmin, controller.acceptComment)
router.route('/:id/reject').put(authMiddleware, isAdmin, controller.rejectComment)


module.exports = router;