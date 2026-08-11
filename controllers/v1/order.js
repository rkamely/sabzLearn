const courseUserModel = require("./../../models/course-user");

exports.getAllOrders = async (req, res) => {
  const orders = await courseUserModel.find()
    .populate('course', 'title href')
    .populate('user', '_id name')
    .lean()
  if (!orders) return res.status(404).send("No orders found.");
  return res.status(200).json(orders)
}

exports.getOneOrder = async (req, res) => {
  const {id} = req.params;
  const order = await courseUserModel.findOne({_id:id})
    .populate('course', 'title href')
    .populate('user', '_id name')
    .lean()
  if (!order) return res.status(404).send("there is problem to update contact.");
  return res.status(200).json(order)
}


