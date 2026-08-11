const express = require('express');
const controller = require('../../controllers/v1/sim-card');
const authMiddleware = require('../../middlewares/auth');
const router = express.Router();



router.route('/').post(controller.getSimCards)
router.route('/filter-configs').get(controller.getFilterConfigs)
router.route('/installment-term').get(controller.getInstallmentsTerm)
router.route('/call-prices-sim-card').post(controller.callPricesSimCard)
router.route('/register-sim-card').post(authMiddleware,controller.registerSimCard)


module.exports = router;