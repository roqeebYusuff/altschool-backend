const mongoose = require("");

const mongoose = require("mongoose");
const COLLECTION_NAME = "user";
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
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(COLLECTION_NAME, userSchema);
