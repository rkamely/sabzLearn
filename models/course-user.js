const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    price: {type: Number, required: true},
    course: {type: mongoose.Types.ObjectId, ref: 'Course', required: true},
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
  }, {timestamps: true}
)
const model = mongoose.model('CourseUser', schema);
module.exports = model;