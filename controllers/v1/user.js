const userModel = require("./../../models/user");
const banUserModel = require("./../../models/ban-phone");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
exports.banUser = async (req, res) => {
  const mainUser = await userModel.findOne({_id: req.params.id});
  const banUserResult = await banUserModel.create({phone: mainUser.phone})
  if (banUserResult) {
    return res.status(200).json({message: "User banned successfully"});
  }
  return res.status(500).send({message: "Server error"})
}

exports.getUsers = async (req, res) => {
  try {
    const users = await userModel.find({}).select('-password -__v');
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({message: err.message})
  }
}

exports.removeUser = async (req, res) => {
  const isValidId = mongoose.isValidObjectId(req.params.id);
  if (!isValidId) {
    return res.status(401).json({message: "User ID is not Valid"})
  }
  const removeUser = await userModel.findByIdAndDelete({_id: req.params.id})
  if (!removeUser) {
    return res.status(401).json({message: "User does not exist"})
  }
}

exports.changeRole = async (req, res) => {
  try {
    const {id} = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({message: "Invalid User ID"});
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {role: newRole},
      {new: true} // Returns the updated document
    );

    return res.status(200).json({message: "Role updated", updatedUser});
  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message});
  }
}

exports.updateUser = async (req, res) => {
  try {
    const {name, email, username, password, phone} = req.body;
    const hashPassword = bcrypt.hash(password)
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name,
        username,
        password: hashPassword,
        confirmPassword: hashPassword,
        phone,
        email
      },
      {new: true, select: "-password -__v"}
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({message: "User not found"});
    }

    return res.status(200).json({message: "User updated successfully", user: updatedUser});

  } catch (error) {
    return res.status(500).json({message: "Server error", error: error.message});
  }
}