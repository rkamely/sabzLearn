const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    mobileNumber: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    nationalCode: { type: String },
    gender: { type: Number },
    salary: { type: Number },
    education: { type: String },
    costMonthly: { type: Number },
    ownershipStatus: { type: Number },
    address: { type: String },
    dependants: { type: Number },
    cityId: { type: Number },
    provinceId: { type: Number },
    referralSource: { type: Number },
    postalCode: { type: String },
    reffererCode: { type: String },
    fatherName: { type: String },
    referralSource:{ type: String },
  },
  { timestamps: true },
);
const model = mongoose.model("User", schema);
module.exports = model;
