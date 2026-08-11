const userModel = require("../../models/user");
const userBanModel = require("../../models/ban-phone");
const registerValidator = require("../../validators/register");
const createUniqueReferralCode = require("../../utils/createUniqueReferralCode");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { mobileNumber } = req.query;

  const validationResult = await registerValidator({ mobileNumber });

  if (!validationResult) {
    return res.status(422).send({ validationResult });
  }

  const isUserBan = await userBanModel.find({ mobileNumber });
  if (isUserBan.length) {
    return res.status(422).send({ message: "User already banned" });
  }

  return res
    .status(200)
    .send({ status: 200, Message: `عملیات با موفقیت انجام شد۰`, result: true });
};

exports.verifyOtp = async (req, res) => {
  const { mobileNumber, otp } = req.query;

  const validationResult = await registerValidator({ mobileNumber });

  if (!validationResult) {
    return res.status(422).send({ validationResult });
  }

  let user = await userModel.findOne({ mobileNumber });
  if (!user) {
    const referralSource = await createUniqueReferralCode();

    user = await userModel.create({
      mobileNumber,
      referralSource,
    });
  }

  if (otp !== "11111") {
    return res.status(402).send({
      status: 402,
      Message: "کد ارسالی اشتباه است.",
      result: false,
    });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return res.status(200).send({
    status: 200,
    Message: "عملیات با موفقیت انجام شد.",
    result: accessToken,
  });
};

exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  const user = await userModel.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });
  if (!user) {
    return res.status(401).send({ message: "User does not exist" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send({ message: "Password is incorrect" });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30 day",
  });

  return res.status(200).send({ accessToken });
};

exports.getMe = async (req, res) => {};
