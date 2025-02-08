const userModel = require("../../models/user");
const userBanModel = require("../../models/ban-phone");
const registerValidator = require("../../validators/register");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const validationResult = await registerValidator(req.body);

  if (!validationResult) {
    return res.status(422).send({validationResult})
  }

  const {username, name, email, password, phone} = req.body;

  const isUserBan = await userBanModel.find({phone})
  if (isUserBan.length) {
    return res.status(422).send({message: "User already banned"})
  }

  const isUserExist = await userModel.findOne({
    $or: [{username: username}, {email: email}]
  });

  if (isUserExist) {
    return res.status(409).send({message: "User already exist"})
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const countOfRegister = await userModel.countDocuments()

  const user = await userModel.create({
    username, name, email, password: hashedPassword, phone, role: countOfRegister > 0 ? 'USER' : 'ADMIN'
  })

  const userObject = user.toObject()
  Reflect.deleteProperty(userObject, 'password')

  const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: '30 day'
  })
  return res.status(200).send({userObject, accessToken})
}

exports.login = async (req, res) => {
  const {identifier, password} = req.body;
  const user = await userModel.findOne({
    $or: [{email: identifier}, {username: identifier}]
  })
  if (!user) {
    return res.status(401).send({message: "User does not exist"})
  }
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).send({message: "Password is incorrect"})
  }

  const accessToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
    expiresIn: '30 day'
  })

  return res.status(200).send({accessToken})
}

exports.getMe = async (req, res) => {
}