const express = require('express');
const controller = require('../../controllers/v1/menu');
const authMiddleware = require('../../middlewares/auth');
const isAdmin = require('../../middlewares/isAdmin');

const router = express.Router();


router.route('/')
  .get(controller.getAllMenu)
  .post(authMiddleware,isAdmin,controller.createMenu)

router.route('/all')
  .get(authMiddleware,isAdmin,controller.getAllInPanel)

router.route('/')
  .delete(authMiddleware,isAdmin,controller.deleteMenu)


module.exports = router;