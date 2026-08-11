const userModel = require("../models/user");

const generateReferralCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
};

const createUniqueReferralCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = generateReferralCode();

    exists = await userModel.exists({
      referrerCode: code,
    });
  }

  return code;
};

module.exports = createUniqueReferralCode;