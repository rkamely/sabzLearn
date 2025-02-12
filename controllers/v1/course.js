const courseModel = require("./../../models/course");
const sessionModel = require("./../../models/session");
const courseUserModel = require("./../../models/course-user");
const categoryModel = require("./../../models/category");
const commentModel = require("./../../models/comment");


exports.createCourse = async (req, res) => {
  const {title, description, support, href, price, status, discount, categoryId} = req.body;
  const course = await courseModel.create({
    title,
    description,
    cover: req.file.filename,
    support,
    href,
    price,
    status,
    discount,
    categoryId,
    creator: req.user._id
  })

  const mainCourse = await courseModel.find(course._id).populate("creator", "-password")

  return res.status(200).json(mainCourse)
}

exports.createSession = async (req, res) => {
  const {title, time, free} = req.body;

  const courseId = req.params.id;
  const session = await sessionModel.create({
    title,
    time,
    video: req.file.filename,
    free,
    course: courseId,
  })

  return res.status(200).json({session})
}

exports.getCourseSessions = async (req, res) => {
  const {href, sessionId} = req.params;

  const course = await courseModel.findOne({href: href}).lean()

  const session = await sessionModel.findOne({_id: sessionId}).lean()

  const allSessions = await sessionModel.find({course: course._id}).lean()

  return res.status(200).json({session, allSessions})
}

exports.deleteSession = async (req, res) => {
  const {id} = req.params;
  const deletedSession = await sessionModel.findByIdAndDelete({_id: id}).lean()
  return res.status(200).json(deletedSession)
}

exports.registerCourse = async (req, res) => {
  const isAlreadyRegistered = await courseUserModel.findOne({user: req.user._id, course: req.body.course}).lean()
  if (isAlreadyRegistered) {
    return res.status(409).json({message: "User already registered"})
  }
  const registerUser = await courseUserModel.create({
    user: req.user._id,
    course: req.body.course,
    price: req.body.price
  })
  return res.status(200).json(registerUser)
}

exports.getCoursesByCategory = async (req, res) => {
  const {href} = req.params;
  const category = await categoryModel.findOne({href}).lean();

  if (category) {
    const allCourses = await courseModel.find({categoryId: category._id}).lean();
    return res.status(200).json(allCourses);
  } else {
    return res.status(200).json([]);
  }
}

exports.getCourseDetails = async (req, res) => {
  const {href} = req.params;

  const course = await courseModel.findOne({href})
    .populate('creator', '-password')
    .populate('categoryId')
    .lean();

  if (!course) {
    return res.status(200).json({ message: "There aren't any course" });
  }

  const sessions = await sessionModel.find({course: course._id}).lean()

  const comments = await commentModel.find({
    course: course._id,
    isAccept: 1
  }).populate('creator', '-password')
    .populate('course')
    .lean()

  const usersCourse = await courseUserModel.find({course: course._id}).countDocuments().lean()

  const mainCommentByAnswers = comments
    .filter(comment => !comment.mainCommentId) // Filter main comments
    .map(comment => ({
      ...comment,
      answeredComment: comments.filter(answerComment => String(answerComment.mainCommentId) === String(comment._id)),
    }));



  if (course) {
    return res.status(200).json({course, sessions, comments: mainCommentByAnswers, usersCourse});
  } else {
    return res.status(200).json({message: "there aren't any course"});
  }
}

exports.getRelatedCourses = async (req, res) => {
  const {href} = req.params;
  const course = await courseModel.findOne({href}).lean();
  const relatedCourses = await courseModel.find({categoryId: course.categoryId});
  const filteredCourses = await relatedCourses.filter(item => item.href !== course.href)
  if (filteredCourses) {
    return res.status(200).json(filteredCourses);
  } else {
    return res.status(200).json({message: "there aren't any related course"});
  }
}
