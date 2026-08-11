const categoryModel = require("./../../models/category");
const categoryValidator = require("../../validators/category");
const {isValidObjectId} = require("mongoose");

exports.getCategories = async (req, res) => {
  const allCategories = await categoryModel.find({})
  if (allCategories) {
    return res.status(200).json(allCategories);
  }
}

exports.addCategory = async (req, res) => {
  const validationResult = await categoryValidator(req.body);
  if (!validationResult) {
    return res.status(422).send({validationResult})
  }
  const {title, href} = req.body;
  const newCategory = await categoryModel.create({title, href});
  return res.status(201).json({newCategory});
}

exports.removeCategory = async (req, res) => {
  const categoryId = isValidObjectId(req.params.id);
  if (!categoryId) {
    return res.status(401).send({message: "Category ID is not Valid"})
  }
  const removeCategory = await categoryModel.findByIdAndDelete(req.params.id);
  if (!removeCategory) {
    return res.status(401).send({message: "Category does not exist"})
  }
  return res.status(200).send({message: "Category removed successfully"})

}

exports.updateCategory = async (req, res) => {
  const categoryId = isValidObjectId(req.params.id);
  if (!categoryId) {
    return res.status(401).send({message: "Category ID is not Valid"})
  }
  const {title, href} = req.body;
  const validationResult = await categoryValidator(req.body);
  if (!validationResult) {
    return res.status(422).send({validationResult})
  }

  const updatedCategory = await categoryModel.findByIdAndUpdate(req.params.id, {title, href}, {
    new: true,
    select: '-__v'
  });
  if (!updatedCategory) {
    return res.status(401).send({message: "Category does not exist"})
  }
  return res.status(200).send({message: "Category updated successfully",updatedCategory})
}