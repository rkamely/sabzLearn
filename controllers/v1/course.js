const courseModel = require("./../../models/course");
const mongoose = require("mongoose");


exports.createCourse = async (req, res) => {
  const {title, description, support, href, price, status, discount, categoryId} = req.body;
  const course = await courseModel.create({
    title,
    description,
    cover: req.file.filename,
    support,
    href,
    price,
    status,
    discount,
    categoryId,
    creator: req.user._id
  })

  const mainCourse = await courseModel.find(course._id).populate("creator", "-password")

  return res.status(200).json(mainCourse)
}

