const express = require('express');
const controller = require('../../controllers/v1/voucher');
const authMiddleware = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();


router.route('/').get(authMiddleware, isAdmin, controller.getAllVouchers)
router.route('/').post(authMiddleware, isAdmin, controller.createVoucher)
router.route('/campaign').post(authMiddleware, isAdmin, controller.createCampaign)
router.route('/:code').post(authMiddleware, controller.applyCode)
// router.route('/:id').delete(authMiddleware, isAdmincontroller.deleteVoucher)


module.exports = router;