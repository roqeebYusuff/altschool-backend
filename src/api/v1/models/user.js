const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const { hashPassword } = require("../../../utils/passwordUtils");
const CONFIG = require("../../../config/config");
const uniqueValidator = require("mongoose-unique-validator");

const COLLECTION_NAME = "users";
const Schema = mongoose.Schema;

let userSchema = Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    username: { type: String, required: true, unique: true, trim: true },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

/* Validator  */
userSchema.plugin(uniqueValidator);

// Hash User Password Before saving
userSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    user["password"] = hashPassword(user["password"]);
  }
  next();
});

// Hash users password before insertMany
userSchema.pre("insertMany", async (next, docs) => {
  if (Array.isArray(docs) && docs.length) {
    const hashedPassword = docs.map(async (user) => {
      user.password = hashPassword(user.password);
    });

    docs = hashedPassword;
  }
  next();
});

// Create Session for user
function createSessionToken(_id) {
  const sessionToken = jsonwebtoken.sign(
    {
      _id,
      type: "User",
      timestamp: Date.now(),
    },
    CONFIG.SECRET_JWT,
    { expiresIn: "1h" } //Expires in an hour
  );
  return sessionToken;
}

module.exports = mongoose.model(COLLECTION_NAME, userSchema);
module.exports.createSessionToken = createSessionToken;
