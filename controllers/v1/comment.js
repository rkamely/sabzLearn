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



