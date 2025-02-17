const articleModel = require("./../../models/article");
const {isValidObjectId} = require("mongoose");


exports.getOneArticle = async (req, res) => {

}

exports.getAllArticle = async (req, res) => {

}

exports.editArticle = async (req, res) => {

}

exports.createArticle = async (req, res) => {
  const {title, description, body, publish, href, categoryId} = req.body;
  if (!isValidObjectId(categoryId)) {
    return res.status(400).json({message: "Category id is invalid"});
  }
  if (!req.file) {
    return res.status(400).json({ message: "Cover image is required" });
  }
  const newArticle = await articleModel.create({
      title,
      description,
      body,
      publish,
      href,
      categoryId,
      creator: req.user._id,
      cover: req.file.filename,
    }
  )
  if (!newArticle) {
    return res.status(400).json({message: "There is problem to create new article"});

  }
  return res.json(newArticle)

}

exports.removeArticle = async (req, res) => {

}


