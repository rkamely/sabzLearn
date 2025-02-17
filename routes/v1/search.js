const express = require('express');
const controller = require('../../controllers/v1/search');

const router = express.Router();

router.route('/:keyword').get(controller.searchCourses)

module.exports = router;