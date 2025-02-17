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

exports.getAllComments = async (req, res) => {

  try {
    // Fetch all comments and populate necessary fields
    const allComments = await commentModel.find()
      .lean();

    // Filter out comments that are not main comments
    const filteredComments = allComments.filter(comment => !comment.mainCommentId);

    // Add sub-comments to the corresponding main comments
    filteredComments.forEach(filtered => {
      // Initialize sub-comments for each main comment
      filtered.subComments = [];

      // Find the sub-comments for this main comment
      allComments.forEach(comment => {
        if (comment.mainCommentId && comment.mainCommentId.toString() === filtered._id.toString()) {
          filtered.subComments.push(comment);
        }
      });
    });

    // If no comments are found, return an error response
    if (filteredComments.length === 0) {
      return res.status(402).json({ message: 'There are no comments' });
    }

    // Return the filtered comments with sub-comments
    return res.status(200).json(filteredComments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

