const userModel = require('./../models/user');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {

  const authHeader = req.headers?.authorization?.split(' ');


  if (authHeader?.length !== 2) {
    return res.status(401).send('Not authorized');
  }
  const token = authHeader[1];
  try {
    const jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(jwtPayload.id).lean()
    Reflect.deleteProperty(user, 'password')
    req.user = user
    next()
  } catch (err) {
    return res.status(401).send({message: err.message})
  }
}