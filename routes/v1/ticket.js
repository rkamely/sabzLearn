const express = require('express');
const controller = require('../../controllers/v1/ticket');
const authMiddleware = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();

router.route('/departments').get(controller.getDepartments)
router.route('/department/:id/subDepartments').get(controller.getSubDepartments)
router.route('/user').get(authMiddleware, controller.getUserTickets)
router.route('/:id/detailsTicket').get(authMiddleware, controller.getDetailsTicket)
router.route('/').get(authMiddleware, controller.getAllTickets)

router.route('/department').post(authMiddleware, isAdmin, controller.createDepartment)
router.route('/subDepartment').post(authMiddleware, isAdmin, controller.createSubDepartment)
router.route('/answer').post(authMiddleware, isAdmin, controller.answerTicket)
router.route('/').post(authMiddleware, isAdmin, controller.createTicket)


module.exports = router;