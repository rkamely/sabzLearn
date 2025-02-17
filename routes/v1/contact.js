const express = require('express');
const controller = require('../../controllers/v1/contact');
const authMiddleware = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();


router.route('/').get(authMiddleware, isAdmin, controller.getAllContacts)
router.route('/').post(controller.createContact)
router.route('/answer').post(authMiddleware, isAdmin,controller.answerContact)
router.route('/:id').delete(controller.removeContact)


module.exports = router;