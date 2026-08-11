const articleModel = require("./../../models/article");
const {isValidObjectId} = require("mongoose");


exports.getOneArticle = async (req, res) => {
  const {href} = req.params;
  const article = await articleModel.findOne({href}).lean()
  if (!article) return res.status(404).send("No articles found");
  return res.status(200).json(article)
}

exports.getAllArticle = async (req, res) => {
  const allArticles = await articleModel.find({})
    .select('-__v')
    .populate('creator', '_id name')
    .populate('categoryId', '-__v')
    .lean()
  if (!allArticles) return res.status(404).send("No articles found");
  return res.status(200).json(allArticles)
}

exports.editArticle = async (req, res) => {
  const {id} = req.params
  const {title, description, body, publish, href, categoryId} = req.body;
  if (!isValidObjectId(categoryId)) {
    return res.status(400).json({message: "Category id is invalid"});
  }
  if (!req.file) {
    return res.status(400).json({message: "Cover image is required"});
  }

  const updatedArticle = await articleModel.findByIdAndUpdate({_id: id}, {
    title, description, body, publish, href, categoryId, creator: req.user._id, cover: req.file.filename,
  })
  if (!updatedArticle) {
    return res.status(400).json({message: "There is problem to update article"});

  }
  return res.json(updatedArticle)
}

exports.createArticle = async (req, res) => {
  const {title, description, body, publish, href, categoryId} = req.body;
  if (!isValidObjectId(categoryId)) {
    return res.status(400).json({message: "Category id is invalid"});
  }
  if (!req.file) {
    return res.status(400).json({message: "Cover image is required"});
  }
  const newArticle = await articleModel.create({
    title, description, body, publish, href, categoryId, creator: req.user._id, cover: req.file.filename,
  })
  if (!newArticle) {
    return res.status(400).json({message: "There is problem to create new article"});

  }
  return res.json(newArticle)
}

exports.removeArticle = async (req, res) => {
  const {id} = req.params
  if (!isValidObjectId(id)) {
    return res.status(400).json({message: "Article id is invalid"});
  }
  const deletedArticle=await articleModel.findByIdAndDelete({_id:id})
  if (!deletedArticle) {
    return res.status(400).json({message: "There is problem to create new article"});
  }
  return res.json({message: "The article has been deleted"})
}


