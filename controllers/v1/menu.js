const menuModel = require("./../../models/menu");

exports.getAllMenu = async (req, res) => {
  const allMenu = await menuModel.find({}).lean()
  if (!allMenu) {
    return res.status(400).json({message: "No menu found"});
  }
  return res.status(200).json(allMenu);
}

exports.createMenu = async (req, res) => {
  const {title, href, parent} = req.body;
  const menu=await menuModel.create({title, href, parent})
  return res.status(200).json(menu)
}

exports.getAllInPanel = async (req, res) => {
  const allMenu = await menuModel.find({}).populate('parent').lean()
  if (!allMenu) {
    return res.status(400).json({message: "No menu found"});
  }
  return res.status(200).json(allMenu);
}

exports.deleteMenu = async (req, res) => {
  const {id} = req.params
  const ticket = await ticketModel.find({_id: id})
  const ticketAnswer = await ticketModel.findOne({parent: id})
  if (ticket) return res.status(200).json({ticket, ticketAnswer})
}





