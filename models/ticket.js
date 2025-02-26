const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    body: {type: String, required: true},
    priority: {type: Number, required: true},
    answer: {type: Number, required: true},
    isAnswer: {type: Number, required: true},
    departmentId: {type: mongoose.Types.ObjectId, ref: 'Department', required: true},
    subDepartmentId: {type: mongoose.Types.ObjectId, ref: 'SubDepartment', required: true},
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    course: {type: mongoose.Types.ObjectId, ref: 'Course'},
    parent: {type: mongoose.Types.ObjectId, ref: 'Ticket'},
  }, {timestamps: true}
)
const model = mongoose.model('Ticket', schema);
module.exports = model;