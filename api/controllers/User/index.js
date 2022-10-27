const { errorCodes } = require("../../constants/errorCodes");
const { errorMessages } = require("../../constants/errorMessages");
const userModel = require("../../models/user");

module.exports.signin = (req, res) => {
  let { email, password } = req.body;

  /* Check if required fields are provided */
  if (!email || !password) {
    return res.json({
      success: false,
      errorCode: errorCodes.BAD_REQUEST,
      message: errorMessages.INVALID_CREDENTIALS,
    });
  }

  userModel
    .findOne({ email })
    .select("+password")
    .then((user) => {
      res.json({
        user,
      });
      //   if (!user || !passwordUtils.checkPassword(user["password"], password))
      //     throw ErrorMessages.INVALID_CREDENTAILS;

      //   delete user.password;
      //   res.json({
      //     success: true,
      //     user,
      //     token: AdminUser.createSessionToken(user._id),
      //   });
    })
    .catch((error) => {
      res.json({
        success: false,
        errorCode: errorCodes.SERVER_ERROR,
        message: error,
      });
    });
};
