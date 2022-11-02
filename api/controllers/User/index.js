const { statusCodes } = require("../../constants/statusCodes");
const { statusMessages } = require("../../constants/statusMessages");
const userModel = require("../../models/user");
const { checkPassword } = require("../../utils/passwordUtils");

module.exports.signin = (req, res) => {
  let { email, password } = req.body;

  /* Check if required fields are provided */
  if (!email || !password) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      message: statusMessages.PROVIDE_REQUIRED_FIELDS,
    });
  }

  userModel
    .findOne({ email })
    .select("+password") //select password to compare
    .then((user) => {
      if (!user || !checkPassword(user["password"], password)) {
        return res.status(statusCodes.BAD_REQUEST).json({
          succes: false,
          message: statusMessages.INVALID_CREDENTIALS,
        });
      }
      // unselect password
      delete user.password;
      return res.status(statusCodes.SUCCESS).json({
        success: true,
        user,
        token: userModel.createSessionToken(user._id),
      });
    })
    .catch((error) => {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        message: error,
      });
    });
};

/* User signup */
module.exports.signup = (req, res) => {
  let { first_name, last_name, email, username, password } = req.body;

  if (!first_name || !last_name || !email || !username || !password) {
    return res.status(statusCodes.BAD_REQUEST).json({
      success: false,
      message: statusMessages.PROVIDE_REQUIRED_FIELDS,
    });
  }

  let user = new userModel({
    first_name,
    last_name,
    email,
    username,
    password,
  });

  user.save((error, success) => {
    if (error) {
      return res.status(statusCodes.SERVER_ERROR).json({
        success: false,
        message,
      });
    }

    return res.status(statusCodes.CREATED).json({
      success: true,
      user: success,
    });
  });
};
