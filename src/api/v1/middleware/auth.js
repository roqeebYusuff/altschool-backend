const config = require("../../../config/config");
const { statusCodes } = require("../../../constants/statusCodes");
const jwt = require("jsonwebtoken");

module.exports.authorize = (req, res, next) => {
  /* Get header */
  let token = req.headers.authorization;
  if (typeof token !== "undefined") {
    /**
     * Split header to get token
     * sanple Bearer token
     * `Bearer E4fer4....`
     */
    token = token.split(" ")[1];
    if (token) {
      jwt.verify(token, config.SECRET_JWT, (err, decoded) => {
        if (err) {
          res.status(statusCodes.UNAUTHORIZED).json({
            status: false,
            message: err,
          });
        } else {
          next();
        }
      });
    } else {
      res
        .status(statusCodes.UNAUTHORIZED)
        .json({ status: false, message: "malformed auth header" });
    }
  } else {
    res.status(statusCodes.UNAUTHORIZED).json({
      success: false,
      message: "No authorization header",
    });
  }
};
