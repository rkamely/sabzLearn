const express = require('express');
const controller = require('../../controllers/v1/comment');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();


router.route('/').post( authMiddleware, controller.createComment)


module.exports = router;