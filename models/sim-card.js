const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    prettyNumber: { type: String, required: true },
    type: { type: Number, required: true },
    typeUsing: { type: Number, required: true },
    price: { type: Number, required: true },
    payType: { type: Number ,default :1}, // 1 is Cash , 2 is installments
  },
  { timestamps: true },
);
const model = mongoose.model("SimCard", schema);
module.exports = model;
