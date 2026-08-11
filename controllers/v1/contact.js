const contactModel = require("./../../models/contact");
const nodemailer = require("nodemailer");


exports.getAllContacts = async (req, res) => {
  const contacts = await contactModel.find().lean()
  if (!contacts) return res.status(404).send("No contacts found.");
  return res.status(200).json(contacts)
}

exports.createContact = async (req, res) => {
  const {name, email, phone, body} = req.body;
  const newContacts = await contactModel.create({
    name, email, phone, answer: 0, body
  })
  if (!newContacts) return res.status(404).send("there is problem to create contact.");
  return res.status(200).json(newContacts)
}

exports.answerContact = async (req, res) => {
  const {email, answer} = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'r.kamely@gmail.com',
      pass: 'test password'
    }
  })
  const mailOptions = {
    from: 'r.kamely@gmail.com',
    to: email,
    subject: 'Contact Information',
    text: answer
  }
  transporter.sendMail(mailOptions, (error, info) => {
    // if (error) return res.status(500).send(error)
  })

  const updatedContact = await contactModel.findOneAndUpdate({email: email}, {answer: 1}, {
    new: true,
    select: '-__v'
  })
  if (!updatedContact) return res.status(404).send("there is problem to update contact.");
  return res.status(200).json(updatedContact)
}

exports.removeContact = async (req, res) => {
  const {id} = req.params;
  const updatedContact = await contactModel.findByIdAndDelete(id,)
  if (!updatedContact) return res.status(404).send("there is problem to update contact.");
  return res.status(200).json("message deleted")
}


