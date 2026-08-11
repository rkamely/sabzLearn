const Validator = require("fastest-validator");

const v = new Validator();
const schema = {
  mobileNumber: { type: "string" },
  lastName: { type: "string", optional: true },
  firstName: { type: "string", optional: true },
  nationalCode: { type: "string", optional: true },
  gender: { type: "number", optional: true },
  education: { type: "string", optional: true },
  dependants: { type: "number", optional: true },
  ownershipStatus: { type: "number", optional: true },
  address: { type: "string", optional: true },
  postalCode: { type: "string", optional: true },
  cityId: { type: "number", optional: true },
  provinceId: { type: "number", optional: true },
  fatherName: { type: "string", optional: true },
  referralSource: { type: "number", optional: true },
  salary: { type: "number", optional: true, nullable: true },
  costMonthly: { type: "number", optional: true, nullable: true },
  referralSource: { type: "string", optional: true, nullable: true },

  $$strict: true,
};
const check = v.compile(schema);
module.exports = check;
