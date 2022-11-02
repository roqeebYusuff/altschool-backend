const jsonwebtoken = require("jsonwebtoken");

module.exports.verifyToken = function (req, res, next) {
  let token = "";
  // verify a token symmetric
  jsonwebtoken.verify(token, "shhhhh", function (err, decoded) {
    if (err) {
      res.send({
        message: "Token Expired",
      });
    }
    next();
  });
};
