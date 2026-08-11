const notificationModel = require("./../../models/notification");


exports.getAllNotification = async (req, res) => {
  const notifications = await notificationModel.find({}).lean()
  if (!notifications) return res.status(404).send("No notification found.");
  return res.status(200).json(notifications)
}
exports.getAdminNotification = async (req, res) => {
  const {_id} = req.user;
  const notifications = await notificationModel.find({admin: _id}).lean()
  if (!notifications) return res.status(404).send("No notification found.");
  return res.status(200).json(notifications)
}

exports.createNotification = async (req, res) => {
  const {message, admin} = req.body;
  const newNotification = await notificationModel.create({
    message, admin
  })
  if (!newNotification) return res.status(404).send("there is problem to create contact.");
  return res.status(200).json(newNotification)
}


exports.seen = async (req, res) => {
  const {id} = req.params;
  const updatedContact = await notificationModel.findByIdAndUpdate(id, {seen: 1})
  if (!updatedContact) return res.status(404).send("there is problem to update contact.");
  return res.status(200).json("ok")
}


