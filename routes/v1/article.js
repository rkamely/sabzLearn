const express = require('express');
const controller = require('../../controllers/v1/article');
const authMiddleware = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();


router.route('/:href').get(controller.getOneArticle)
router.route('/').get(controller.getAllArticle)
router.route('/draft').post(authMiddleware, isAdmin, controller.saveDraftArticle)
router.route('/').post(authMiddleware, isAdmin, controller.createArticle)
router.route('/:id').delete(authMiddleware, isAdmin, controller.removeArticle)


module.exports = router;