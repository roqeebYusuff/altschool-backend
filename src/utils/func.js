const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports.readingTime = (words) => {
  let wordCount = words.split(" ").length; //count words
  //using 233 words per minute
  let wordsperMinute = 233;
  let readingTime = wordCount / wordsperMinute;

  let mins = Math.floor(readingTime);
  let secs = (readingTime - Math.floor(readingTime)).toFixed(2) * 0.6;

  let result = Math.ceil(mins + secs); // Round to ceil

  return result;
};

module.exports.getLoggedInID = (token) => {
  return new Promise(function (resolve, reject) {
    token = token.split(" ")[1];
    if (token) {
      jwt.verify(token, config.SECRET_JWT, (err, decoded) => {
        if (err) {
          reject({ success: false, message: err });
        }
        resolve({ success: true, decoded: decoded._id });
      });
    } else {
      reject({ success: false, message: "error" });
    }
  });
};
