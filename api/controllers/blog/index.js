const { statusCodes } = require("../../constants/statusCodes");
const { statusMessages } = require("../../constants/statusMessages");
const blogModel = require("../../models/blog");
const { readingTime, getLoggedInID } = require("../../utils/func");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getOneBlog = (req, res) => {
  let id = req.params.id;

  blogModel
    .findOne({ _id: id })
    .populate("author")
    .then((blog) => {
      blog.read_count = blog.read_count + 1; /* Increase read count by one */
      blog.save((err, done) => {
        //save
        if (err) {
          return res.status(statusCodes.SERVER_ERROR).json({
            success: true,
            errorCode: statusCodes.SERVER_ERROR,
            message: err,
          });
        }
        return res.status(statusCodes.SUCCESS).json({
          success: true,
          blog,
        });
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
  let { state, author, title, tags, page } = req.query;

  var query = {};
  var options = {
    sort: { read_count: -1, reading_time: -1, created_at: -1 },
    // populate: "author",
    page: page ? page : 1 /* if page number is not provided show page 1 */,
    limit: 20,
  };

  /* Paginate */
  blogModel
    .paginate(query, options)
    .then((blog) => {
      return res.status(statusCodes.SUCCESS).json({
        success: true,
        blogs: blog.docs,
        totalBlogs: blog.totalDocs,
        page: blog.page,
        perPage: blog.limit,
        hasPrevPage: blog.hasPrevPage,
        hasNextPage: blog.hasNextPage,
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

module.exports.authorBlogs = (req, res) => {
  let { state } = req.query;
  getLoggedInID(req.headers.authorization)
    .then((response) => {
      /* Find author blogs */
      var query = { author: ObjectId(response) };
      /* Filter by state when state query is provided */
      if (state) {
        query.state = state;
      }
      var options = {
        // page: 20,
        limit: 20,
      };
      blogModel
        .paginate(query, options)
        .then((blog) => {
          return res.status(statusCodes.SUCCESS).json({
            success: true,
            blogs: blog.docs,
            totalBlogs: blog.totalDocs,
            page: blog.page,
            perPage: blog.limit,
            hasPrevPage: blog.hasPrevPage,
            hasNextPage: blog.hasNextPage,
          });
        })
        .catch((err) => {
          return res.status(statusCodes.SERVER_ERROR).json({
            success: false,
            statusCode: statusCodes.SERVER_ERROR,
            message: err,
          });
        });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        statusCode: statusCodes.SERVER_ERROR,
        message: err,
      });
    });
};

/* Logged in users only */
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

/* owner of blog only update blog state */
module.exports.updateBlog = (req, res) => {
  let { id } = req.params;
  let { state } = req.body; // update blog state

  if (!state) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      errorCode: statusCodes.BAD_REQUEST,
      message: statusMessages.PROVIDE_REQUIRED_FIELDS,
    });
  }

  /* Find blog by id then compare author id with id on token */
  blogModel
    .findById(id)
    .then((blog) => {
      if (!blog) {
        return res.status(statusCodes.BAD_REQUEST).json({
          success: false,
          errorCode: statusCodes.BAD_REQUEST,
          message: statusMessages.INVALID_REQUEST,
        });
      } else {
        /* CHeck if logged in user owns blog */
        getLoggedInID(req.headers.authorization)
          .then((response) => {
            /* Compare two mongoose id */
            if (String(response) === String(blog.author)) {
              /* Update BLog */
              blog.state = state;
              blog.save((err, updatedBlog) => {
                if (err) {
                  return res.status(statusCodes.SERVER_ERROR).json({
                    success: false,
                    errorCode: statusCodes.SERVER_ERROR,
                    message: err,
                  });
                }
                return res.status(statusCodes.SUCCESS).json({
                  success: true,
                  blog: updatedBlog,
                });
              });
            } else {
              return res.status(statusCodes.FORBIDDEN).json({
                success: false,
                statusCode: statusCodes.FORBIDDEN,
                message: statusMessages.FORBIDDEN,
              });
            }
          })
          .catch((err) => {
            res.json({ err });
          });
      }
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        errorCode: statusCodes.SERVER_ERROR,
        message: err,
      });
    });
};

/* Only blog owner can delete blog */
module.exports.deleteBlog = async (req, res) => {
  let { id } = req.params;

  /* Find blog by id then compare author id with id on token */
  blogModel
    .findById(id)
    .then((blog) => {
      if (!blog) {
        return res.status(statusCodes.BAD_REQUEST).json({
          success: false,
          errorCode: statusCodes.BAD_REQUEST,
          message: statusMessages.INVALID_REQUEST,
        });
      } else {
        /* CHeck if logged in user owns blog */
        getLoggedInID(req.headers.authorization)
          .then((response) => {
            /* Compare two mongoose id */
            if (String(response) === String(blog.author)) {
              /* Update BLog */
              blog.delete((err, deletedBlog) => {
                if (err) {
                  return res.status(statusCodes.SERVER_ERROR).json({
                    success: false,
                    errorCode: statusCodes.SERVER_ERROR,
                    message: err,
                  });
                }
                return res.status(statusCodes.SUCCESS).json({
                  success: true,
                  blog: deletedBlog,
                });
              });
            } else {
              return res.status(statusCodes.FORBIDDEN).json({
                success: false,
                status: statusCodes.FORBIDDEN,
                message: statusMessages.FORBIDDEN,
              });
            }
          })
          .catch((err) => {
            return res.status(statusCodes.SERVER_ERROR).json({
              success: false,
              errorCode: statusCodes.SERVER_ERROR,
              message: err,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        errorCode: statusCodes.SERVER_ERROR,
        message: err,
      });
    });
};
