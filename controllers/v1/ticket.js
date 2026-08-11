const ticketModel = require("./../../models/ticket");
const departmentModel = require("./../../models/department");
const subDepartmentModel = require("./../../models/subDepartment");

exports.getDepartments = async (req, res) => {
  const departments = await departmentModel.find({}).lean()
  if (!departments) {
    return res.status(400).json({message: "No departments found"});
  }
  return res.status(200).json(departments);
}

exports.getSubDepartments = async (req, res) => {
  const {id} = req.params
  const subDepartments = await subDepartmentModel.find({parent: id})
    .populate('parent', 'title')
    .lean()

  if (!subDepartments) {
    return res.status(400).json({message: "No subDepartments found"});
  }
  return res.status(200).json(subDepartments);
}

exports.getUserTickets = async (req, res) => {
  const userTickets = await ticketModel.find({user: req.user._id}).sort({createdAt: -1}).lean()
  if (userTickets) {
    return res.status(200).json(userTickets)
  }
}

exports.getDetailsTicket = async (req, res) => {
  const {id} = req.params
  const ticket = await ticketModel.find({_id: id})
  const ticketAnswer = await ticketModel.findOne({parent: id})
  if (ticket) return res.status(200).json({ticket, ticketAnswer})
}

exports.getAllTickets = async (req, res) => {
  const allTickets = await ticketModel.find({answer: 0})
    .populate('departmentId', 'title')
    .populate('subDepartmentId', 'title')
    .populate('course', 'title href')
    .populate('user', 'name')
    .lean()
  if (allTickets) {
    return res.status(200).json(allTickets)
  }
}

exports.createTicket = async (req, res) => {
  const {title, body, priority, departmentId, subDepartmentId, course} = req.body
  const newTicket = await ticketModel.create({
    title, body, priority, departmentId, subDepartmentId, course, user: req.user._id, answer: 0, isAnswer: 0
  })
  const mainTicket = await ticketModel.findOne({_id: newTicket?._id})
    .populate('departmentId', 'title')
    .populate('subDepartmentId', 'title')
    .populate('course', 'title href')
    .populate('user', 'name')
    .lean()
  if (mainTicket) {
    return res.status(200).json(mainTicket)
  }
}

exports.answerTicket = async (req, res) => {
  const {body, ticketId} = req.body
  const parentTicket = await ticketModel.findByIdAndUpdate({_id: ticketId}, {answer: 1}).lean()
  if (!parentTicket) {
    return res.status(400).json({message: 'there is not any parent ticket'})
  }
  const answer = await ticketModel.create({
    title: 'پاسخ تیکت شما',
    body,
    parent: ticketId,
    priority: parentTicket.priority,
    user: req.user._id,
    answer: 0,
    isAnswer: 1,
    departmentId: parentTicket.departmentId,
    subDepartmentId: parentTicket.subDepartmentId,
  })

  if (answer) {
    return res.status(200).json(answer)
  }
}

exports.createDepartment = async (req, res) => {
  const {title} = req.body;
  const newDepartment = await departmentModel.create({title});
  if (newDepartment) {
    return res.status(200).json(newDepartment);
  }
}

exports.createSubDepartment = async (req, res) => {
  const {title, parent} = req.body;
  const newSubDepartment = await subDepartmentModel.create({title, parent});
  if (newSubDepartment) {
    return res.status(200).json(newSubDepartment);
  }
}



