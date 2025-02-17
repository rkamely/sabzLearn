const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    title: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    cover: {type: String, required: true},
    description: {type: String, required: true},
    body: {type: String, required: true},
    publish: {type: Number, required: true},
    href: {type: String, required: true},
    categoryId: {type: mongoose.Types.ObjectId, ref: "Category", required: true},
  }, {timestamps: true}
)
schema.virtual("comments", {
  ref: 'ArticleComments',
  localField: '_id',
  foreignField: 'article',
})
const model = mongoose.model('Article', schema);
module.exports = model;