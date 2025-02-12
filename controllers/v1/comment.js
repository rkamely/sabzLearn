const commentModel = require("./../../models/comment");



exports.createComment = async (req, res) => {
  const {comment, course, score, mainCommentId} = req.body;
  const newComment = await commentModel.create({
    comment,
    course,
    creator: req.user._id,
    isAnswered: 0,
    score,
    mainCommentId,
  })

  return res.status(200).json(newComment)
}
exports.deleteComment = async (req, res) => {
  const {id} = req.params;
  await commentModel.findByIdAndDelete({_id: id})
  return res.status(200).json({message: "Comment deleted"})
}

exports.acceptComment = async (req, res) => {
  const {id} = req.params;
  const acceptedComment = await commentModel.findByIdAndUpdate({_id: id}, {isAccept: 1})
  if (!acceptedComment) {
    return res.status(401).json({message: "Comment does not exist"})
  }
  return res.status(200).json({message: "Comment accepted"})
}

exports.rejectComment = async (req, res) => {
  const {id} = req.params;
  const acceptedComment = await commentModel.findByIdAndUpdate({_id: id}, {isAccept: 0})
  if (!acceptedComment) {
    return res.status(401).json({message: "Comment does not exist"})
  }
  return res.status(200).json({message: "Comment rejected"})
}

exports.answerComment = async (req, res) => {
  const {answer} = req.body;
  const {id} = req.params;
  const acceptedComment = await commentModel.findByIdAndUpdate({_id: id}, {isAccept: 1})
  if (!acceptedComment) return res.status(402).json({message: 'comment not found'})
  await commentModel.create({
    comment: answer,
    course: acceptedComment.course,
    creator: req.user._id,
    isAnswered: 1,
    isAccept: 1,
    mainCommentId: id
  })
  return res.status(200).json({message: "Comment created"})
}



