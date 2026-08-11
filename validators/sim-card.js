const Validator = require("fastest-validator");

const v = new Validator();
const schema = {
  number: { type: "string" },
  type: { type: "number" },
  typeUsing: { type: "number"},
  price: { type: "number" },
};
const check = v.compile(schema);
module.exports = check;
