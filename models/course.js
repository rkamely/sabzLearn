const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    description: {type: String, required: true},
    cover: {type: String, required: true},
    support: {type: String, required: true},
    href: {type: String, required: true},
    price: {type: Number, required: true},
    status: {type: String, required: true},
    discount: {type: Number, required: true},
    categoryId: {type: mongoose.Types.ObjectId, ref: 'Category', required: true},
    creator: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
  }, {timestamps: true}
)
schema.virtual("sessions", {
  ref: 'Session',
  localField: '_id',
  foreignField: 'course',
})
schema.virtual("comments", {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'course',
})

const model = mongoose.model('Course', schema);
module.exports = model;