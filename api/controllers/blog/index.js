const { statusCodes } = require("../../constants/statusCodes");
const { statusMessages } = require("../../constants/statusMessages");
const blogModel = require("../../models/blog");
const { readingTime } = require("../../utils/func");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

module.exports.getOneBlog = (req, res) => {
  let id = req.params.id;
  if (!id) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      errorCode: statusCodes.BAD_REQUEST,
      message: statusMessages.BAD_REQUEST,
    });
  }

  blogModel
    .findById(id)
    .then((response) => {
      res.status(statusCodes.SUCCESS).json({
        success: true,
        blog: response,
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        errorCode: statusCodes.SERVER_ERROR,
        message: err,
      });
    });
};

module.exports.allBlogs = (req, res) => {
  blogModel
    .find({})
    .then((response) => {
      return res.status(statusCodes.SUCCESS).json({
        success: true,
        blog: response,
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        errorCode: statusCodes.SERVER_ERROR,
        error: err,
      });
    });
};

module.exports.createBlog = (req, res) => {
  let { title, description, tags, body } = req.body;
  if (!title || !description || !tags || !body) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      errorCode: statusCodes.BAD_REQUEST,
      message: statusMessages.PROVIDE_REQUIRED_FIELDS,
    });
  }

  /* Readding time */
  let reading_time = readingTime(body);

  // get signed user id
  let token = req.headers.authorization; //get token from header authorizatino
  token = token.split(" ")[1];
  let user = jwt.verify(token, config.SECRET_JWT);
  let author = user._id;

  let createBlog = new blogModel({
    title,
    author,
    description,
    tags,
    body,
    reading_time,
  });

  createBlog.save((error, success) => {
    if (error) {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        errorCode: statusCodes.SERVER_ERROR,
        error,
      });
    }

    return res.status(statusCodes.CREATED).json({
      success: true,
      blog: success,
    });
  });
};

module.exports.updateBlog = (req, res) => {
  let { id } = req.params;
  let blog = req.body;

  blogModel
    .findByIdAndUpdate(id, blog)
    .then((response) => {
      return res.status(statusCodes.SUCCESS).json({
        success: true,
        blog: response,
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        errorCode: statusCodes.SERVER_ERROR,
        message: err,
      });
    });
};

module.exports.deleteBlog = async (req, res) => {
  let { id } = req.params;
  if (!id) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      errorCode: statusCodes.BAD_REQUEST,
      message: statusMessages.BAD_REQUEST,
    });
  }

  await blogModel
    .deleteOne({ _id: id })
    .then((response) => {
      return res.status(statusCodes.SUCCESS).json({
        success: true,
        response,
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        errorCode: statusCodes.SERVER_ERROR,
        message: err,
      });
    });
};
