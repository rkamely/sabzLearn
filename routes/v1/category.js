const express = require('express');
const controller = require('../../controllers/v1/category');
const authMiddleware = require('../../middlewares/auth');
const isAdminMiddleware = require('../../middlewares/isAdmin');
const router = express.Router();


router.route('/')
  .post(authMiddleware, isAdminMiddleware, controller.addCategory)
  .get(controller.getCategories)

router.route('/:id')
  .delete(authMiddleware, isAdminMiddleware, controller.removeCategory)
  .put(authMiddleware,isAdminMiddleware, controller.updateCategory)


module.exports = router;