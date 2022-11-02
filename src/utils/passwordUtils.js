const crypto = require("crypto");

const SALT_LENGTH = 9;

/* Hash Password */
module.exports.hashPassword = (password) => {
  var salt = generateSalt(SALT_LENGTH);
  var hash = md5(password + salt);
  return salt + hash;
};

/* Check Password */
module.exports.checkPassword = (hash, password) => {
  var salt = hash.substr(0, SALT_LENGTH);
  var validHash = salt + md5(password + salt);
  return hash === validHash;
};

/*  */
function generateSalt(len) {
  var set = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ",
    setLen = set.length,
    salt = "";
  for (var i = 0; i < len; i++) {
    var p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

function md5(string) {
  return crypto.createHash("md5").update(string).digest("hex");
}
