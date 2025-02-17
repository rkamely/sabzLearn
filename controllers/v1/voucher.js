const voucherModel = require("./../../models/voucher");
const courseModel = require("./../../models/course");


exports.getAllVouchers = async (req, res) => {
  const vouchers = await voucherModel.find({}, '-__v')
    .populate('course', 'title href')
    .populate('creator', 'name')
    .lean()

  if (!vouchers) return res.status(404).send("No vouchers found.");
  return res.status(200).json(vouchers)
}

exports.createVoucher = async (req, res) => {
  const {code, course, percent, max} = req.body;
  const newVoucher = await voucherModel.create({
    code, course, percent, max, uses: 0, creator: req.user._id
  })
  if (!newVoucher) return res.status(404).send("there is problem to create voucher.");
  return res.status(200).json(newVoucher)
}

exports.createCampaign = async (req, res) => {
  const {discount} = req.body;
  const updatedCourses = await courseModel.updateMany({discount})
  if (!updatedCourses) return res.status(404).send("there aren't any courses to update.");
  return res.status(200).json("All courses Updated")
}

exports.applyCode = async (req, res) => {
  const {code} = req.params;
  const {course} = req.body;
  const targetVoucher = await voucherModel.findOne({code, course}).lean()
  if (!targetVoucher) return res.status(404).send("voucher is not valid.");
  else if (targetVoucher.uses === targetVoucher.max) return res.status(404).send("voucher has used.");
  else {
    await voucherModel.findOneAndUpdate({code, course}, {uses: targetVoucher.uses + 1})
    return res.status(200).json(targetVoucher)

  }
}
// exports.deleteVoucher = async (req, res) => {
//   const {id} = req.params;
//   const updatedContact = await contactModel.findByIdAndDelete(id,)
//   if (!updatedContact) return res.status(404).send("there is problem to update contact.");
//   return res.status(200).json("message deleted")
// }


