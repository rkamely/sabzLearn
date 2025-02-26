const express = require('express');
const controller = require('../../controllers/v1/order');
const authMiddleware = require('../../middlewares/auth');

const router = express.Router();


router.route('/').get(authMiddleware, controller.getAllOrders)

router.route('/:id').get(authMiddleware,controller.getOneOrder)


module.exports = router;