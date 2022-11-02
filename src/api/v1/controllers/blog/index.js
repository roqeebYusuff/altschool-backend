const { statusCodes } = require("../../../../constants/statusCodes");
const { statusMessages } = require("../../../../constants/statusMessages");
const blogModel = require("../../models/blog");
const { readingTime, getLoggedInID } = require("../../../../utils/func");
const jwt = require("jsonwebtoken");
const config = require("../../../../config/config");
const ObjectId = require("mongoose").Types.ObjectId;

// only published blogs
module.exports.getOneBlog = async (req, res) => {
  let id = req.params.id;

  const blog = await blogModel
    .findOne({ _id: id, state: "published" })
    .populate("author");

  if (!blog) {
    return res.status(statusCodes.NOT_FOUND).json({
      success: false,
      blog: null,
    });
  }

  /* Increase read count by one */
  blog.read_count = blog.read_count + 1;
  await blog.save(); //save

  return res.status(statusCodes.SUCCESS).json({
    success: true,
    blog,
  });
};

// all published blogs
module.exports.allBlogs = (req, res) => {
  let { author, title, tags, page, read_count, reading_time, timestamp } =
    req.query;

  var query = {};
  author ? (query.author = author) : "";
  title ? (query.title = title) : "";
  // tags ? (query.tags = tags) : "";
  var options = {
    sort: {
      read_count: read_count == "asc" ? 1 : read_count == "desc" ? -1 : -1,
      reading_time:
        reading_time == "asc" ? 1 : reading_time == "desc" ? -1 : -1,
      createdAt: timestamp == "asc" ? 1 : timestamp == "desc" ? -1 : -1, // Default is 'desc'
    },
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
        totalPages: blog.totalPages,
        page: blog.page,
        perPage: blog.limit,
        hasPrevPage: blog.hasPrevPage,
        hasNextPage: blog.hasNextPage,
      });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
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
      state ? (query.state = state) : (query.state = "");

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
            totalPages: blog.totalPages,
            page: blog.page,
            perPage: blog.limit,
            hasPrevPage: blog.hasPrevPage,
            hasNextPage: blog.hasNextPage,
          });
        })
        .catch((err) => {
          return res.status(statusCodes.SERVER_ERROR).json({
            success: false,
            message: err,
          });
        });
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
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
  let { state, title, description, body, tags } = req.body; // update blog state

  if (!state && !title && !description && !body && !tags) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      message: statusMessages.PROVIDE_REQUIRED_FIELDS,
    });
  }

  /* Find blog by id then compare author id with id on token */
  blogModel
    .findById(id)
    .then((blog) => {
      if (!blog) {
        return res.status(statusCodes.NOT_FOUND).json({
          success: false,
          blog: null,
        });
      } else {
        /* CHeck if logged in user owns blog */
        getLoggedInID(req.headers.authorization)
          .then((response) => {
            /* Compare two mongoose id */
            if (String(response) === String(blog.author)) {
              /* Update BLog if fields are provided */
              blog.state = state ? state : blog.state;
              blog.title = title ? title : blog.title;
              blog.description = description ? description : blog.description;
              blog.body = body ? body : blog.body;
              blog.tags = tags && tags.length ? tags : blog.tags;
              blog.save((err, updatedBlog) => {
                if (err) {
                  return res.status(statusCodes.SERVER_ERROR).json({
                    success: false,
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
                message: statusMessages.FORBIDDEN,
              });
            }
          })
          .catch((err) => {
            return res.status(statusCodes.SERVER_ERROR).json({
              success: false,
              message: err,
            });
          });
      }
    })
    .catch((err) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
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
        message: err,
      });
    });
};
